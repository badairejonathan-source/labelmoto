'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  Send,
} from 'lucide-react';

import {
  useUser,
} from '@/firebase/client';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Textarea,
} from '@/components/ui/textarea';

import {
  useToast,
} from '@/hooks/use-toast';

import Link from 'next/link';

interface SupportReply {
  body: string;
  channel: 'email' | 'account';
  actor: 'user' | 'labelmoto';
  createdAt?: string | null;
}

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: 'new' | 'replied';
  conversationState:
    | 'waiting_labelmoto'
    | 'waiting_user'
    | 'closed';
  userUnread: boolean;
  submittedAt?: string | null;
  repliedAt?: string | null;
  lastActivityAt?: string | null;
  replies: SupportReply[];
}

function formatDate(value?: string | null) {
  if (!value) {
    return 'Date inconnue';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Date inconnue';
  }

  return new Intl.DateTimeFormat(
    'fr-FR',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(date);
}

function conversationLabel(
  item: SupportMessage
) {
  if (item.userUnread) {
    return 'Nouveau';
  }

  if (
    item.conversationState ===
    'waiting_labelmoto'
  ) {
    return 'En attente LabelMoto';
  }

  if (
    item.conversationState ===
    'waiting_user'
  ) {
    return 'À vous';
  }

  return 'Clos';
}

export default function SupportMessagesAccount() {
  const {
    user,
  } = useUser();

  const {
    toast,
  } = useToast();

  const [
    messages,
    setMessages,
  ] =
    useState<SupportMessage[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    drafts,
    setDrafts,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    sendingId,
    setSendingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    expandedIds,
    setExpandedIds,
  ] =
    useState<
      Record<string, boolean>
    >({});

  const loadMessages =
    useCallback(
      async (): Promise<SupportMessage[]> => {
        if (!user) {
          setMessages([]);
          setLoading(false);
          return [];
        }

        setLoading(true);

        try {
          const token =
            await user.getIdToken();

          const response =
            await fetch(
              '/api/support-messages',
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
                cache: 'no-store',
              }
            );

          const payload =
            await response.json();

          if (!response.ok) {
            throw new Error(
              payload?.error ||
              'Chargement impossible.'
            );
          }

          const loadedMessages:
            SupportMessage[] =
              Array.isArray(
                payload.messages
              )
                ? payload.messages
                : [];

          setMessages(
            loadedMessages
          );

          return loadedMessages;
        } catch (error) {
          console.error(
            '[ACCOUNT SUPPORT] Chargement impossible :',
            error
          );

          return [];
        } finally {
          setLoading(false);
        }
      },
      [user]
    );

  const markRead =
    useCallback(
      async (
        messageIds: string[]
      ) => {
        if (
          !user ||
          messageIds.length === 0
        ) {
          return;
        }

        try {
          const token =
            await user.getIdToken();

          const response =
            await fetch(
              '/api/support-messages',
              {
                method: 'PATCH',
                headers: {
                  'Content-Type':
                    'application/json',
                  Authorization:
                    `Bearer ${token}`,
                },
                body:
                  JSON.stringify({
                    messageIds,
                  }),
              }
            );

          if (!response.ok) {
            return;
          }

          const readIds =
            new Set(messageIds);

          setMessages(
            current =>
              current.map(
                item =>
                  readIds.has(
                    item.id
                  )
                    ? {
                        ...item,
                        userUnread:
                          false,
                      }
                    : item
              )
          );

          window.dispatchEvent(
            new Event(
              'labelmoto:support-unread-changed'
            )
          );
        } catch (error) {
          console.error(
            '[ACCOUNT SUPPORT] Lecture impossible :',
            error
          );
        }
      },
      [user]
    );

  const scrollThreadToBottom =
    useCallback(
      (
        messageId: string
      ) => {
        window.requestAnimationFrame(
          () => {
            const thread =
              document.getElementById(
                `support-thread-${messageId}`
              );

            if (thread) {
              thread.scrollTop =
                thread.scrollHeight;
            }
          }
        );
      },
      []
    );

  const toggleConversation =
    async (
      item: SupportMessage
    ) => {
      const nextExpanded =
        !expandedIds[
          item.id
        ];

      setExpandedIds(
        current => ({
          ...current,
          [item.id]:
            nextExpanded,
        })
      );

      if (!nextExpanded) {
        return;
      }

      if (item.userUnread) {
        await markRead([
          item.id,
        ]);
      }

      scrollThreadToBottom(
        item.id
      );
    };

  const sendReply =
    async (
      item: SupportMessage
    ) => {
      if (!user) {
        return;
      }

      const reply =
        String(
          drafts[item.id] ||
          ''
        ).trim();

      if (reply.length < 2) {
        toast({
          variant:
            'destructive',
          title:
            'Réponse trop courte',
        });

        return;
      }

      setSendingId(
        item.id
      );

      try {
        const token =
          await user.getIdToken(
            true
          );

        const response =
          await fetch(
            '/api/support-messages',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify({
                  messageId:
                    item.id,
                  reply,
                }),
            }
          );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.error ||
            'Envoi impossible.'
          );
        }

        setDrafts(
          current => ({
            ...current,
            [item.id]:
              '',
          })
        );

        toast({
          title:
            'Réponse envoyée à LabelMoto',
        });

        await loadMessages();

        setExpandedIds(
          current => ({
            ...current,
            [item.id]:
              true,
          })
        );

        scrollThreadToBottom(
          item.id
        );

        window.dispatchEvent(
          new Event(
            'labelmoto:support-unread-changed'
          )
        );
      } catch (error: any) {
        toast({
          variant:
            'destructive',
          title:
            'Envoi impossible',
          description:
            error?.message ||
            'Une erreur est survenue.',
        });
      } finally {
        setSendingId(
          null
        );
      }
    };

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const handleOpen =
      () => {
        void loadMessages();
      };

    window.addEventListener(
      'labelmoto:support-open',
      handleOpen
    );

    return () => {
      window.removeEventListener(
        'labelmoto:support-open',
        handleOpen
      );
    };
  }, [
    loadMessages,
  ]);

  return (
    <Card
      id="messages-labelmoto"
      className="mt-8 overflow-hidden rounded-[2.5rem] border-none bg-white shadow-xl"
    >
      <CardHeader className="border-b bg-muted/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
              <MessageSquare className="h-5 w-5 text-brand" />
              Messages LabelMoto
            </CardTitle>

            <CardDescription className="mt-1">
              Vos échanges avec l’équipe LabelMoto.
            </CardDescription>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl font-black uppercase text-[9px] tracking-widest"
          >
            <Link href="/contact">
              <Send className="mr-2 h-3.5 w-3.5" />
              Nouveau message
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-6 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground" />

            <p className="mt-2 text-xs font-black uppercase">
              Aucun message LabelMoto
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Vos futurs échanges avec l’équipe apparaîtront ici.
            </p>
          </div>
        ) : (
          messages.map(
            item => {
              const isExpanded =
                Boolean(
                  expandedIds[
                    item.id
                  ]
                );

              const replies =
                Array.isArray(
                  item.replies
                )
                  ? item.replies
                  : [];

              const lastReply =
                replies.length > 0
                  ? replies[
                      replies.length -
                        1
                    ]
                  : null;

              const preview =
                lastReply?.body ||
                item.message ||
                '';

              return (
                <article
                  key={item.id}
                  className={
                    item.userUnread
                      ? 'rounded-2xl border-2 border-brand/50 bg-brand/[0.02] p-4'
                      : 'rounded-2xl border-2 p-4'
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black">
                        {item.subject ||
                          'Message LabelMoto'}
                      </h3>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {formatDate(
                          item.submittedAt
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Badge
                        variant={
                          item.userUnread ||
                          item.conversationState ===
                            'waiting_user'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-[8px] font-black uppercase"
                      >
                        {conversationLabel(
                          item
                        )}
                      </Badge>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          void toggleConversation(
                            item
                          )
                        }
                        className="h-8 rounded-full px-3 text-[8px] font-black uppercase tracking-widest"
                      >
                        {isExpanded ? (
                          <ChevronUp className="mr-1.5 h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
                        )}

                        {isExpanded
                          ? 'Réduire'
                          : item.userUnread
                            ? 'Lire le message'
                            : 'Voir la conversation'}
                      </Button>
                    </div>
                  </div>

                  {!isExpanded && (
                    <div className="mt-3 rounded-xl bg-muted/20 px-4 py-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        Dernier échange
                      </p>

                      <p className="mt-1 line-clamp-2 text-sm text-foreground/75">
                        {preview}
                      </p>
                    </div>
                  )}

                  {isExpanded && (
                    <>
                      <div
                        id={`support-thread-${item.id}`}
                        className="mt-4 max-h-[52vh] space-y-3 overflow-y-auto overscroll-contain pr-1 sm:max-h-[380px]"
                      >
                        <div className="rounded-xl bg-muted/30 p-4">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                            Votre message
                          </p>

                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                            {item.message}
                          </p>
                        </div>

                        {replies.map(
                          (
                            reply,
                            index
                          ) => {
                            const fromUser =
                              reply.actor ===
                              'user';

                            return (
                              <div
                                key={`${item.id}-${index}`}
                                className={
                                  fromUser
                                    ? 'rounded-xl bg-muted/30 p-4'
                                    : 'rounded-xl border border-brand/20 bg-brand/5 p-4'
                                }
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p
                                    className={
                                      fromUser
                                        ? 'text-[9px] font-black uppercase tracking-widest text-muted-foreground'
                                        : 'text-[9px] font-black uppercase tracking-widest text-brand'
                                    }
                                  >
                                    {fromUser
                                      ? 'Votre réponse'
                                      : 'Réponse LabelMoto'}
                                  </p>

                                  <p className="text-[9px] font-bold text-muted-foreground">
                                    {formatDate(
                                      reply.createdAt
                                    )}
                                  </p>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                                  {reply.body}
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="mt-4 space-y-3 border-t pt-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Répondre à LabelMoto
                        </p>

                        <Textarea
                          value={
                            drafts[
                              item.id
                            ] || ''
                          }
                          onChange={
                            event =>
                              setDrafts(
                                current => ({
                                  ...current,
                                  [item.id]:
                                    event.target.value,
                                })
                              )
                          }
                          rows={3}
                          placeholder="Écrivez votre réponse..."
                          className="resize-y"
                        />

                        <Button
                          type="button"
                          onClick={() =>
                            void sendReply(
                              item
                            )
                          }
                          disabled={
                            sendingId ===
                            item.id
                          }
                          className="rounded-xl font-black uppercase text-[9px] tracking-widest"
                        >
                          {sendingId ===
                          item.id ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-3.5 w-3.5" />
                          )}

                          Envoyer à LabelMoto
                        </Button>
                      </div>
                    </>
                  )}
                </article>
              );
            }
          )
        )}
      </CardContent>
    </Card>
  );
}
