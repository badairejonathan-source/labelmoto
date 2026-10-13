'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useFirebase,
} from '@/firebase/client';

interface AdminSupportUnreadBadgeProps {
  mode?: 'badge' | 'number';
  baseCount?: number | null;
}

export default function AdminSupportUnreadBadge({
  mode = 'badge',
  baseCount,
}: AdminSupportUnreadBadgeProps) {
  const {
    user,
  } = useFirebase();

  const [
    count,
    setCount,
  ] =
    useState(0);

  const loadCount =
    useCallback(
      async () => {
        if (!user) {
          setCount(0);
          return;
        }

        try {
          const token =
            await user.getIdToken();

          const response =
            await fetch(
              '/api/admin/support-messages?summary=1',
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
                cache: 'no-store',
              }
            );

          if (!response.ok) {
            return;
          }

          const payload =
            await response.json();

          setCount(
            Number(
              payload?.unreadCount ||
              0
            )
          );
        } catch {
          // Badge non bloquant.
        }
      },
      [user]
    );

  useEffect(() => {
    void loadCount();

    const interval =
      window.setInterval(
        () => {
          void loadCount();
        },
        20000
      );

    const refresh =
      (
        event?: Event
      ) => {
        if (
          event instanceof
            CustomEvent &&
          typeof
            event.detail
              ?.unreadCount ===
            'number'
        ) {
          setCount(
            Math.max(
              0,
              Number(
                event.detail
                  .unreadCount
              ) || 0
            )
          );

          return;
        }

        void loadCount();
      };

    window.addEventListener(
      'focus',
      refresh
    );

    window.addEventListener(
      'labelmoto:admin-support-unread-changed',
      refresh
    );

    return () => {
      window.clearInterval(
        interval
      );

      window.removeEventListener(
        'focus',
        refresh
      );

      window.removeEventListener(
        'labelmoto:admin-support-unread-changed',
        refresh
      );
    };
  }, [loadCount]);

  if (mode === 'number') {
    if (baseCount === null) {
      return <>—</>;
    }

    return (
      <>
        {(baseCount || 0) + count}
      </>
    );
  }

  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[8px] font-black leading-none text-white"
      aria-label={`${count} demande${count > 1 ? 's' : ''} de support non lue${count > 1 ? 's' : ''}`}
    >
      {count > 99
        ? '99+'
        : count}
    </span>
  );
}
