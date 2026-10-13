import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

import {
  getAdminAuth,
  getAdminFirestore,
} from '@/lib/firebase-admin';

import {
  emailService,
} from '@/services/email-service';

const ADMIN_UIDS = [
  'A36FqeWBHjQBLKQMaMSiFVBzGV22',
  'A366V1X8Hqf1pA63nU3N8B7l8fD3',
  'f7xVfH8R8mS5v8H7N3nU3N8B7l8f',
];

const ADMIN_EMAILS = [
  'badjoe950@hotmail.com',
];

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
  snapshot: admin.firestore.DocumentSnapshot,
  source: 'support' | 'legacy'
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
    source,
    name: cleanText(data.name, 160),
    email: cleanText(data.email, 320),
    subject: cleanText(data.subject, 300),
    message: cleanText(data.message, 12000),
    senderUid:
      cleanText(data.senderUid, 256) || null,
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
    adminUnread:
      source === 'support' &&
      data.adminUnread === true,
    userUnread:
      source === 'support' &&
      data.userUnread === true,
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

async function requireAdmin(request: NextRequest) {
  const authorization =
    request.headers.get('authorization');

  if (
    !authorization ||
    !authorization.startsWith('Bearer ')
  ) {
    throw new Error('AUTH_REQUIRED');
  }

  const idToken =
    authorization.slice('Bearer '.length).trim();

  let decodedToken;

  try {
    decodedToken =
      await getAdminAuth().verifyIdToken(idToken);
  } catch {
    throw new Error('AUTH_REQUIRED');
  }

  const tokenEmail =
    decodedToken.email || '';

  const isMaster =
    decodedToken.email_verified === true &&
    (
      ADMIN_UIDS.includes(decodedToken.uid) ||
      (
        tokenEmail &&
        ADMIN_EMAILS.includes(tokenEmail)
      )
    );

  if (!isMaster) {
    const db =
      getAdminFirestore();

    const userSnapshot =
      await db
        .collection('users')
        .doc(decodedToken.uid)
        .get();

    if (
      !userSnapshot.exists ||
      userSnapshot.data()?.role !== 'admin'
    ) {
      throw new Error('ADMIN_REQUIRED');
    }
  }

  return decodedToken;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const db = getAdminFirestore();

    if (
      request.nextUrl.searchParams.get(
        'summary'
      ) === '1'
    ) {
      const unreadSnapshot =
        await db
          .collection('support_messages')
          .where(
            'adminUnread',
            '==',
            true
          )
          .limit(100)
          .get();

      return NextResponse.json({
        ok: true,
        unreadCount:
          unreadSnapshot.size,
      });
    }

    const [
      supportSnapshot,
      legacySnapshot,
    ] =
      await Promise.all([
        db
          .collection('support_messages')
          .orderBy(
            'submittedAt',
            'desc'
          )
          .limit(100)
          .get(),
        db
          .collection('contact_messages')
          .orderBy(
            'submittedAt',
            'desc'
          )
          .limit(100)
          .get(),
      ]);

    const messages = [
      ...supportSnapshot.docs.map(
        item =>
          serializeMessage(
            item,
            'support'
          )
      ),
      ...legacySnapshot.docs.map(
        item =>
          serializeMessage(
            item,
            'legacy'
          )
      ),
    ]
      .sort(
        (left, right) => {
          const leftTime =
            left.lastActivityAt
              ? new Date(
                  left.lastActivityAt
                ).getTime()
              : left.submittedAt
                ? new Date(
                    left.submittedAt
                  ).getTime()
                : 0;

          const rightTime =
            right.lastActivityAt
              ? new Date(
                  right.lastActivityAt
                ).getTime()
              : right.submittedAt
                ? new Date(
                    right.submittedAt
                  ).getTime()
                : 0;

          return rightTime - leftTime;
        }
      )
      .slice(0, 100);

    return NextResponse.json({
      ok: true,
      messages,
    });
  } catch (error: any) {
    const forbidden =
      error?.message === 'ADMIN_REQUIRED';

    return NextResponse.json(
      {
        ok: false,
        error:
          forbidden
            ? 'Droits administrateur requis.'
            : 'Authentification requise.',
      },
      {
        status:
          forbidden
            ? 403
            : 401,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin(request);

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
            'Aucun message à marquer comme lu.',
        },
        {
          status: 400,
        }
      );
    }

    const db =
      getAdminFirestore();

    const batch =
      db.batch();

    messageIds.forEach(messageId => {
      batch.update(
        db
          .collection('support_messages')
          .doc(messageId),
        {
          adminUnread: false,
        }
      );
    });

    await batch.commit();

    return NextResponse.json({
      ok: true,
    });
  } catch (error: any) {
    const forbidden =
      error?.message === 'ADMIN_REQUIRED';

    return NextResponse.json(
      {
        ok: false,
        error:
          forbidden
            ? 'Droits administrateur requis.'
            : 'Impossible de mettre à jour la lecture.',
      },
      {
        status:
          forbidden
            ? 403
            : 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminToken =
      await requireAdmin(request);

    const body =
      await request.json();

    const messageId =
      cleanText(
        body?.messageId,
        256
      );

    const source =
      body?.source === 'legacy'
        ? 'legacy'
        : 'support';

    const reply =
      cleanText(
        body?.reply,
        12000
      );

    if (
      !messageId ||
      reply.length < 2
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Réponse invalide.',
        },
        {
          status: 400,
        }
      );
    }

    const db =
      getAdminFirestore();

    const ref =
      db
        .collection(
          source === 'legacy'
            ? 'contact_messages'
            : 'support_messages'
        )
        .doc(messageId);

    const snapshot =
      await ref.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Message introuvable.',
        },
        {
          status: 404,
        }
      );
    }

    const data =
      snapshot.data() || {};

    const senderUid =
      cleanText(
        data.senderUid,
        256
      );

    const channel:
      'email' | 'account' =
        senderUid
          ? 'account'
          : 'email';

    if (channel === 'email') {
      const email =
        cleanText(
          data.email,
          320
        );

      if (!email || !email.includes('@')) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Aucune adresse e-mail valide pour ce visiteur.',
          },
          {
            status: 400,
          }
        );
      }

      const result =
        await emailService.sendSupportReply(
          email,
          cleanText(
            data.subject,
            300
          ) || 'Votre message LabelMoto',
          reply,
          cleanText(
            data.message,
            12000
          )
        );

      if (!result.success) {
        return NextResponse.json(
          {
            ok: false,
            error:
              result.error ||
              'Envoi e-mail impossible.',
          },
          {
            status: 502,
          }
        );
      }
    }

    await ref.update({
      status: 'replied',
      replyChannel: channel,
      conversationState:
        channel === 'account'
          ? 'waiting_user'
          : 'closed',
      adminUnread: false,
      userUnread:
        channel === 'account',
      repliedAt:
        admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:
        admin.firestore.FieldValue.serverTimestamp(),
      lastActivityAt:
        admin.firestore.FieldValue.serverTimestamp(),
      replies:
        admin.firestore.FieldValue.arrayUnion({
          body: reply,
          channel,
          actor: 'labelmoto',
          adminUid:
            adminToken.uid,
          createdAt:
            admin.firestore.Timestamp.now(),
        }),
    });

    return NextResponse.json({
      ok: true,
      channel,
    });
  } catch (error: any) {
    console.error(
      '[SUPPORT ADMIN] Réponse impossible :',
      error
    );

    const forbidden =
      error?.message === 'ADMIN_REQUIRED';

    return NextResponse.json(
      {
        ok: false,
        error:
          forbidden
            ? 'Droits administrateur requis.'
            : 'Impossible d’envoyer la réponse.',
      },
      {
        status:
          forbidden
            ? 403
            : 500,
      }
    );
  }
}
