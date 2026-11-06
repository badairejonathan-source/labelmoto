'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  UserRound,
} from 'lucide-react';

import {
  useFirebase,
} from '@/firebase/client';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Button,
} from '@/components/ui/button';

import {
  Textarea,
} from '@/components/ui/textarea';

import {
  useToast,
} from '@/hooks/use-toast';

interface ContactMessage {
  id: string;
  source?: 'support' | 'legacy';
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  senderUid?: string | null;
  initiatedBy?: 'labelmoto' | 'user';
  senderType?: 'guest' | 'user' | 'pro';
  replyChannel?: 'email' | 'account';
  status?: 'new' | 'replied';
  conversationState?:
    | 'waiting_labelmoto'
    | 'waiting_user'
    | 'closed';
  adminUnread?: boolean;
  submittedAt?: string | null;
  repliedAt?: string | null;
  lastActivityAt?: string | null;
  replies?: Array<{
    body: string;
    channel: 'email' | 'account';
    actor: 'user' | 'labelmoto';
    createdAt?: string | null;
  }>;
}

function formatDate(
  value?: string | null
) {
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

function senderLabel(
  type?: ContactMessage['senderType']
) {
  if (type === 'pro') {
    return 'Pro';
  }

  if (type === 'user') {
    return 'Utilisateur';
  }

  return 'Visiteur';
}

function stateLabel(
  contact: ContactMessage
) {
  if (
    contact.source === 'legacy'
  ) {
    return contact.status ===
      'replied'
      ? 'Répondu'
      : 'Nouveau';
  }

  if (
    contact.conversationState ===
    'waiting_labelmoto'
  ) {
    return 'À répondre';
  }

  if (
    contact.conversationState ===
    'waiting_user'
  ) {
    return 'En attente utilisateur';
  }

  return 'Clos';
}

export default function AdminContactMessages() {
  const {
    user,
  } = useFirebase();

  const {
    toast,
  } = useToast();

  const [
    messages,
    setMessages,
  ] =
    useState<ContactMessage[]>(
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

  /* LABELMOTO_ADMIN_CONVERSATIONS_V1 : composition et conversations compactes */
  const [composerOpen, setComposerOpen] = useState(false);
  const [recipients, setRecipients] = useState<Array<{
    uid: string; name: string; email: string; role: 'user' | 'pro';
  }>>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [recipientUid, setRecipientUid] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [creating, setCreating] = useState(false);
  /* LABELMOTO_ADMIN_SUPPRESSION_V2 : suppression individuelle confirmee */
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleComposer = async () => {
    if (composerOpen) { setComposerOpen(false); return; }
    setComposerOpen(true);
    if (!user || recipients.length) return;
    setRecipientsLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/support-messages?recipients=1', {
        headers: { Authorization: 'Bearer ' + token }, cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw Error(payload?.error || 'Comptes indisponibles.');
      setRecipients(Array.isArray(payload.recipients) ? payload.recipients : []);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Destinataires indisponibles',
        description: error?.message || 'Chargement impossible.' });
    } finally { setRecipientsLoading(false); }
  };

  const createConversation = async () => {
    if (!user || creating) return;
    if (!recipientUid || newSubject.trim().length < 5 || newBody.trim().length < 10) {
      toast({ variant: 'destructive', title: 'Informations incomplètes',
        description: 'Choisis un compte, un objet (5 caractères) et un message (10 caractères).' });
      return;
    }
    setCreating(true);
    try {
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ action: 'create', recipientUid,
          subject: newSubject.trim(), message: newBody.trim(), requestId: crypto.randomUUID() }),
      });
      const payload = await response.json();
      if (!response.ok) throw Error(payload?.error || 'Création impossible.');
      setComposerOpen(false);
      setRecipientUid(''); setNewSubject(''); setNewBody('');
      await loadMessages();
      if (payload?.id) setExpandedIds(current => ({ ...current, [payload.id]: true }));
      toast({ title: 'Conversation créée', description: 'Visible dans l’espace du destinataire.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Création impossible',
        description: error?.message || 'Une erreur est survenue.' });
    } finally { setCreating(false); }
  };

  const deleteConversation = async (contact: ContactMessage) => {
    if (!user || deletingId) return;
    const source = contact.source === 'legacy' ? 'legacy' : 'support';
    const key = source + ':' + contact.id;
    const subject = contact.subject || 'Message LabelMoto';
    const confirmed = window.confirm(
      'Supprimer définitivement la conversation « ' + subject + ' » ?\n\n' +
      'Son historique sera effacé de la messagerie LabelMoto et, pour un compte inscrit, de son espace client.\n' +
      'Cette action est irréversible.'
    );
    if (!confirmed) return;
    setDeletingId(key);
    try {
      const token = await user.getIdToken(true);
      const query = new URLSearchParams({ messageId: contact.id, source });
      const response = await fetch('/api/admin/support-messages?' + query, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw Error(payload?.error || 'Suppression impossible.');
      setMessages(current => current.filter(item =>
        !(item.id === contact.id && (item.source || 'support') === source)
      ));
      setExpandedIds(current => {
        const next = { ...current };
        delete next[contact.id];
        return next;
      });
      setDrafts(current => {
        const next = { ...current };
        delete next[contact.id];
        return next;
      });
      window.dispatchEvent(new Event('labelmoto:admin-support-unread-changed'));
      toast({ title: 'Conversation supprimée', description: 'L’historique a été retiré.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Suppression impossible',
        description: error?.message || 'Une erreur est survenue.' });
    } finally {
      setDeletingId(null);
    }
  };

  const markAdminRead =
    useCallback(
      async (
        messageIds: string[]
      ): Promise<boolean> => {
        if (
          !user ||
          messageIds.length === 0
        ) {
          return false;
        }

        try {
          const token =
            await user.getIdToken();

          const response =
            await fetch(
              '/api/admin/support-messages',
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

          const payload =
            await response
              .json()
              .catch(
                () => null
              );

          if (!response.ok) {
            console.error(
              '[ADMIN SUPPORT] Marquage lecture refusé :',
              payload?.error ||
              response.status
            );

            return false;
          }

          window.dispatchEvent(
            new Event(
              'labelmoto:admin-support-unread-changed'
            )
          );

          return true;
        } catch (error) {
          console.error(
            '[ADMIN SUPPORT] Marquage lecture impossible :',
            error
          );

          return false;
        }
      },
      [user]
    );

  const loadMessages =
    useCallback(
      async () => {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const token =
            await user.getIdToken();

          const response =
            await fetch(
              '/api/admin/support-messages',
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
              'Impossible de charger les messages.'
            );
          }

          const loadedMessages:
            ContactMessage[] =
              Array.isArray(
                payload.messages
              )
                ? payload.messages
                : [];

          setMessages(
            loadedMessages
          );
        } catch (error: any) {
          toast({
            variant:
              'destructive',
            title:
              'Messages indisponibles',
            description:
              error?.message ||
              'Impossible de charger les messages.',
          });
        } finally {
          setLoading(false);
        }
      },
      [
        user,
        toast,
      ]
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
                `admin-support-thread-${messageId}`
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
      contact: ContactMessage
    ) => {
      const nextExpanded =
        !expandedIds[
          contact.id
        ];

      setExpandedIds(
        current => ({
          ...current,
          [contact.id]:
            nextExpanded,
        })
      );

      if (!nextExpanded) {
        return;
      }

      if (
        contact.source ===
          'support' &&
        contact.adminUnread
      ) {
        const markedRead =
          await markAdminRead([
            contact.id,
          ]);

        if (markedRead) {
          setMessages(
            current =>
              current.map(
                item =>
                  item.id ===
                  contact.id
                    ? {
                        ...item,
                        adminUnread:
                          false,
                      }
                    : item
              )
          );
        }
      }

      scrollThreadToBottom(
        contact.id
      );
    };

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const copyEmail =
    async (
      email: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          email
        );

        toast({
          title:
            'Adresse e-mail copiée',
        });
      } catch {
        toast({
          variant:
            'destructive',
          title:
            'Copie impossible',
        });
      }
    };

  const sendReply =
    async (
      contact: ContactMessage
    ) => {
      if (!user) {
        return;
      }

      const reply =
        String(
          drafts[contact.id] ||
          ''
        ).trim();

      if (reply.length < 2) {
        toast({
          variant:
            'destructive',
          title:
            'Réponse vide',
        });

        return;
      }

      setSendingId(
        contact.id
      );

      try {
        const token =
          await user.getIdToken(
            true
          );

        const response =
          await fetch(
            '/api/admin/support-messages',
            {
              method:
                'POST',
              headers: {
                'Content-Type':
                  'application/json',
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify({
                  messageId:
                    contact.id,
                  source:
                    contact.source ||
                    'support',
                  reply,
                }),
            }
          );

        const payload =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.error ||
            'Réponse impossible.'
          );
        }

        setDrafts(
          current => ({
            ...current,
            [contact.id]:
              '',
          })
        );

        toast({
          title:
            payload.channel ===
            'email'
              ? 'Réponse envoyée par e-mail'
              : 'Réponse envoyée dans l’espace client',
        });

        window.dispatchEvent(
          new Event(
            'labelmoto:admin-support-unread-changed'
          )
        );

        await loadMessages();

        setExpandedIds(
          current => ({
            ...current,
            [contact.id]:
              true,
          })
        );

        scrollThreadToBottom(
          contact.id
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
        setSendingId(null);
      }
    };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <MessageSquare className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black uppercase tracking-tight">
              Messages reçus
            </h2>

            <p className="text-xs text-muted-foreground">
              Support LabelMoto · {messages.length} message{messages.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={() => void toggleComposer()}
            className="rounded-full font-black uppercase text-[9px] tracking-widest">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {composerOpen ? 'Fermer' : 'Nouvelle conversation'}
          </Button>
          <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            void loadMessages()
          }
          disabled={loading}
          className="rounded-full font-black uppercase text-[9px] tracking-widest"
        >
          {loading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
          )}

          Actualiser
          </Button>
        </div>
      </div>

      {composerOpen && (
        <div className="space-y-3 rounded-2xl border border-brand/20 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-black">Nouvelle conversation · espace client</h3>
          <p className="text-xs text-muted-foreground">Envoi dans la messagerie d’un compte inscrit. Aucun e-mail automatique.</p>
          <label className="block text-xs font-bold" htmlFor="admin-new-recipient">Destinataire</label>
          <select id="admin-new-recipient" value={recipientUid} onChange={event => setRecipientUid(event.target.value)}
            disabled={recipientsLoading || creating}
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm">
            <option value="">{recipientsLoading ? 'Chargement des comptes…' : 'Sélectionner un compte'}</option>
            {recipients.map(item => (
              <option key={item.uid} value={item.uid}>{item.name || item.email} · {item.email} ({item.role === 'pro' ? 'Pro' : 'Utilisateur'})</option>
            ))}
          </select>
          <label className="block text-xs font-bold" htmlFor="admin-new-subject">Objet</label>
          <input id="admin-new-subject" value={newSubject} onChange={event => setNewSubject(event.target.value)}
            maxLength={300} disabled={creating} placeholder="Objet de la conversation"
            className="w-full rounded-xl border px-3 py-2 text-sm" />
          <label className="block text-xs font-bold" htmlFor="admin-new-body">Message</label>
          <Textarea id="admin-new-body" value={newBody} onChange={event => setNewBody(event.target.value)}
            maxLength={12000} rows={4} disabled={creating} placeholder="Votre premier message…" />
          <Button type="button" disabled={creating || recipientsLoading} onClick={() => void createConversation()}
            className="rounded-xl font-black uppercase text-[9px] tracking-widest">
            {creating ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-2 h-3.5 w-3.5" />}
            Créer et envoyer
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-3xl border bg-white p-10 text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />

          <p className="text-sm font-black uppercase tracking-widest">
            Aucun message
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(
            contact => {
              const email =
                String(
                  contact.email ||
                  ''
                ).trim();

              const channel =
                contact.senderUid
                  ? 'account'
                  : 'email';

              const isExpanded =
                Boolean(
                  expandedIds[
                    contact.id
                  ]
                );

              const replies =
                Array.isArray(
                  contact.replies
                )
                  ? contact.replies
                  : [];

              return (
                <article
                  key={contact.id}
                  className={
                    contact.adminUnread
                      ? 'rounded-xl border border-brand/40 bg-brand/[0.02] px-4 py-3 shadow-sm'
                      : 'rounded-xl border bg-white px-4 py-3 shadow-sm'
                  }
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black uppercase tracking-tight">
                          {contact.name ||
                            'Expéditeur inconnu'}
                        </h3>

                        <Badge
                          variant="secondary"
                          className="text-[8px] font-black uppercase"
                        >
                          <UserRound className="mr-1 h-3 w-3" />
                          {senderLabel(
                            contact.senderType
                          )}
                        </Badge>

                        <Badge
                          variant={
                            contact.conversationState ===
                            'waiting_labelmoto'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-[8px] font-black uppercase"
                        >
                          {stateLabel(
                            contact
                          )}
                        </Badge>
                      </div>

                      <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                        {formatDate(
                          contact.submittedAt
                        )}
                      </p>

                      {isExpanded && email && (
                        <button
                          type="button"
                          onClick={() =>
                            void copyEmail(
                              email
                            )
                          }
                          className="mt-1 inline-flex items-center gap-1 break-all text-xs font-bold text-brand hover:underline"
                        >
                          <Copy className="h-3 w-3" />
                          {email}
                        </button>
                      )}

                      <p className={isExpanded ? 'mt-3 font-black' : 'mt-1 truncate text-sm font-semibold text-foreground/75'}>
                        {contact.subject || 'Message LabelMoto'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="w-fit text-[8px] font-black uppercase"
                      >
                        {channel === 'email' ? (
                          <Mail className="mr-1 h-3 w-3" />
                        ) : (
                          <MessageSquare className="mr-1 h-3 w-3" />
                        )}

                        {channel === 'email'
                          ? 'Réponse e-mail'
                          : 'Réponse espace client'}
                      </Badge>

                      {isExpanded && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          title="Supprimer définitivement cette conversation"
                          disabled={deletingId !== null || sendingId === contact.id}
                          onClick={() => void deleteConversation(contact)}
                          className="h-8 rounded-full px-3 text-[8px] font-black uppercase tracking-widest text-red-600 hover:text-red-700"
                        >
                          {deletingId === ((contact.source || 'support') + ':' + contact.id)
                            ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
                          Supprimer
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          void toggleConversation(
                            contact
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
                          : contact.adminUnread
                            ? 'Lire'
                            : 'Voir'}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      <div
                        id={`admin-support-thread-${contact.id}`}
                        className="mt-5 max-h-[55vh] space-y-4 overflow-y-auto overscroll-contain border-t pr-1 pt-4 sm:max-h-[420px]"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                              {contact.initiatedBy === 'labelmoto' ? 'Message initial LabelMoto' : 'Message initial'}
                          </p>

                          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/80">
                            {contact.message ||
                              'Message vide.'}
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
                                key={`${contact.id}-${index}`}
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
                                      ? 'Réponse utilisateur'
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

                      <div className="mt-5 space-y-3 border-t pt-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                          Répondre
                        </p>

                        <Textarea
                          value={
                            drafts[
                              contact.id
                            ] || ''
                          }
                          onChange={
                            event =>
                              setDrafts(
                                current => ({
                                  ...current,
                                  [contact.id]:
                                    event.target.value,
                                })
                              )
                          }
                          rows={4}
                          placeholder={
                            channel === 'email'
                              ? 'Cette réponse sera envoyée par e-mail.'
                              : 'Cette réponse apparaîtra dans son espace client.'
                          }
                          className="resize-y font-medium"
                        />

                        <Button
                          type="button"
                          onClick={() =>
                            void sendReply(
                              contact
                            )
                          }
                          disabled={
                            sendingId ===
                            contact.id
                          }
                          className="rounded-xl font-black uppercase text-[9px] tracking-widest"
                        >
                          {sendingId ===
                          contact.id ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-3.5 w-3.5" />
                          )}

                          {channel === 'email'
                            ? 'Envoyer par e-mail'
                            : 'Envoyer dans son espace'}
                        </Button>
                      </div>
                    </>
                  )}
                </article>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
