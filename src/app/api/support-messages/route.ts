import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

import {
  getAdminAuth,
  getAdminFirestore,
} from '@/lib/firebase-admin';

function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? '').trim().slice(0, maxLength);
}

function toIso(value: any): string | null {
  if (!value) return null;

  try {
    if (typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }

    if (typeof value.seconds === 'number') {
      return new Date(value.seconds * 1000).toISOString();
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function serializeMessage(
  snapshot: admin.firestore.DocumentSnapshot
) {
  const data = snapshot.data() || {};

  const replies = Array.isArray(data.replies)
    ? data.replies.map((reply: any) => ({
        body: cleanText(reply?.body, 12000),
        channel:
          reply?.channel === 'email'
            ? 'email'
            : 'account',
        actor:
          reply?.actor === 'user'
            ? 'user'
            : 'labelmoto',
        createdAt: toIso(reply?.createdAt),
      }))
    : [];

  const conversationState =
    data.conversationState === 'waiting_user'
      ? 'waiting_user'
      : data.conversationState === 'closed'
        ? 'closed'
        : data.conversationState === 'waiting_labelmoto'
          ? 'waiting_labelmoto'
          : data.status === 'replied'
            ? 'waiting_user'
            : 'waiting_labelmoto';

  return {
    id: snapshot.id,
    name: cleanText(data.name, 160),
    email: cleanText(data.email, 320),
    subject: cleanText(data.subject, 300),
    message: cleanText(data.message, 12000),
    senderType:
      data.senderType === 'pro'
        ? 'pro'
        : data.senderType === 'user'
          ? 'user'
          : 'guest',
    replyChannel:
      data.replyChannel === 'account'
        ? 'account'
        : 'email',
    status:
      data.status === 'replied'
        ? 'replied'
        : 'new',
    conversationState,
    userUnread:
      data.userUnread === true,
    adminUnread:
      data.adminUnread === true,
    submittedAt: toIso(data.submittedAt),
    repliedAt: toIso(data.repliedAt),
    lastActivityAt:
      toIso(
        data.lastActivityAt ||
        data.updatedAt ||
        data.submittedAt
      ),
    replies,
  };
}

async function getOptionalIdentity(request: NextRequest) {
  const authorization =
    request.headers.get('authorization');

  if (!authorization) {
    return null;
  }

  if (!authorization.startsWith('Bearer ')) {
    throw new Error('AUTH_INVALID');
  }

  const idToken =
    authorization.slice('Bearer '.length).trim();

  if (!idToken) {
    throw new Error('AUTH_INVALID');
  }

  let decodedToken;

  try {
    decodedToken =
      await getAdminAuth().verifyIdToken(idToken);
  } catch {
    throw new Error('AUTH_INVALID');
  }

  const db = getAdminFirestore();

  const userSnapshot =
    await db
      .collection('users')
      .doc(decodedToken.uid)
      .get();

  const role =
    userSnapshot.data()?.role === 'pro'
      ? 'pro'
      : 'user';

  return {
    uid: decodedToken.uid,
    email: cleanText(decodedToken.email, 320),
    role,
  };
}

async function requireIdentity(request: NextRequest) {
  const identity =
    await getOptionalIdentity(request);

  if (!identity) {
    throw new Error('AUTH_REQUIRED');
  }

  return identity;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messageId =
      cleanText(body?.messageId, 256);

    if (messageId) {
      const reply =
        cleanText(body?.reply, 12000);

      if (reply.length < 2) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Votre réponse est trop courte.',
          },
          {
            status: 400,
          }
        );
      }

      let identity;

      try {
        identity =
          await requireIdentity(request);
      } catch {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Authentification requise.',
          },
          {
            status: 401,
          }
        );
      }

      const db =
        getAdminFirestore();

      const ref =
        db
          .collection('support_messages')
          .doc(messageId);

      const snapshot =
        await ref.get();

      if (!snapshot.exists) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Conversation introuvable.',
          },
          {
            status: 404,
          }
        );
      }

      const data =
        snapshot.data() || {};

      if (
        cleanText(
          data.senderUid,
          256
        ) !== identity.uid
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Accès refusé à cette conversation.',
          },
          {
            status: 403,
          }
        );
      }

      await ref.update({
        status: 'new',
        conversationState:
          'waiting_labelmoto',
        adminUnread: true,
        userUnread: false,
        updatedAt:
          admin.firestore.FieldValue.serverTimestamp(),
        lastActivityAt:
          admin.firestore.FieldValue.serverTimestamp(),
        replies:
          admin.firestore.FieldValue.arrayUnion({
            body: reply,
            channel: 'account',
            actor: 'user',
            userUid:
              identity.uid,
            createdAt:
              admin.firestore.Timestamp.now(),
          }),
      });

      return NextResponse.json({
        ok: true,
      });
    }

    const name =
      cleanText(body?.name, 160);
    const email =
      cleanText(body?.email, 320).toLowerCase();
    const subject =
      cleanText(body?.subject, 300);
    const message =
      cleanText(body?.message, 12000);

    if (
      name.length < 2 ||
      !email.includes('@') ||
      subject.length < 5 ||
      message.length < 10
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Les informations du formulaire sont incomplètes.',
        },
        {
          status: 400,
        }
      );
    }

    let identity = null;

    try {
      identity =
        await getOptionalIdentity(request);
    } catch (error: any) {
      if (error?.message === 'AUTH_INVALID') {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Votre session a expiré. Reconnectez-vous puis réessayez.',
          },
          {
            status: 401,
          }
        );
      }

      throw error;
    }

    const db = getAdminFirestore();

    const saved =
      await db
        .collection('support_messages')
        .add({
          name,
          email:
            identity?.email ||
            email,
          subject,
          message,
          senderUid:
            identity?.uid ||
            null,
          senderType:
            identity?.role ||
            'guest',
          replyChannel:
            identity
              ? 'account'
              : 'email',
          status: 'new',
          conversationState:
            'waiting_labelmoto',
          adminUnread: true,
          userUnread: false,
          replies: [],
          submittedAt:
            admin.firestore.FieldValue.serverTimestamp(),
          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),
          lastActivityAt:
            admin.firestore.FieldValue.serverTimestamp(),
        });

    return NextResponse.json(
      {
        ok: true,
        id: saved.id,
        replyChannel:
          identity
            ? 'account'
            : 'email',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      '[SUPPORT] Écriture message impossible :',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Impossible d’envoyer le message pour le moment.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const identity =
      await requireIdentity(request);

    const db = getAdminFirestore();

    const snapshot =
      await db
        .collection('support_messages')
        .where(
          'senderUid',
          '==',
          identity.uid
        )
        .limit(100)
        .get();

    const docs =
      [...snapshot.docs].sort(
        (a, b) => {
          const leftData =
            a.data() || {};
          const rightData =
            b.data() || {};

          const left =
            leftData.lastActivityAt?.toMillis?.() ||
            leftData.updatedAt?.toMillis?.() ||
            leftData.submittedAt?.toMillis?.() ||
            0;

          const right =
            rightData.lastActivityAt?.toMillis?.() ||
            rightData.updatedAt?.toMillis?.() ||
            rightData.submittedAt?.toMillis?.() ||
            0;

          return right - left;
        }
      );

    if (
      request.nextUrl.searchParams.get(
        'summary'
      ) === '1'
    ) {
      return NextResponse.json({
        ok: true,
        unreadCount:
          docs.filter(
            item =>
              item.data()?.userUnread === true
          ).length,
      });
    }

    return NextResponse.json({
      ok: true,
      messages:
        docs.map(serializeMessage),
    });
  } catch (error) {
    console.error(
      '[SUPPORT] Lecture espace client impossible :',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Impossible de charger vos messages.',
      },
      {
        status: 401,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const identity =
      await requireIdentity(request);

    const body =
      await request.json();

    const rawIds =
      Array.isArray(body?.messageIds)
        ? body.messageIds
        : [body?.messageId];

    const messageIds: string[] =
      Array.from(
        new Set<string>(
          rawIds
            .map((value: unknown) =>
              cleanText(
                value,
                256
              )
            )
            .filter(
              (value: string) =>
                value.length > 0
            )
        )
      ).slice(0, 100);

    if (messageIds.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Aucune conversation à marquer comme lue.',
        },
        {
          status: 400,
        }
      );
    }

    const db =
      getAdminFirestore();

    const refs =
      messageIds.map(
        messageId =>
          db
            .collection('support_messages')
            .doc(messageId)
      );

    const snapshots =
      await Promise.all(
        refs.map(ref =>
          ref.get()
        )
      );

    const unauthorized =
      snapshots.some(
        snapshot =>
          !snapshot.exists ||
          cleanText(
            snapshot.data()?.senderUid,
            256
          ) !== identity.uid
      );

    if (unauthorized) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Accès refusé à une conversation.',
        },
        {
          status: 403,
        }
      );
    }

    const batch =
      db.batch();

    refs.forEach(ref => {
      batch.update(
        ref,
        {
          userUnread: false,
        }
      );
    });

    await batch.commit();

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      '[SUPPORT] Marquage lecture impossible :',
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          'Impossible de mettre à jour la lecture.',
      },
      {
        status: 401,
      }
    );
  }
}
