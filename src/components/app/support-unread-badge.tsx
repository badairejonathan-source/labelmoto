'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useUser,
} from '@/firebase/client';

export default function SupportUnreadBadge() {
  const {
    user,
  } = useUser();

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
              '/api/support-messages?summary=1',
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
        30000
      );

    const refresh =
      () => {
        void loadCount();
      };

    window.addEventListener(
      'focus',
      refresh
    );

    window.addEventListener(
      'labelmoto:support-unread-changed',
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
        'labelmoto:support-unread-changed',
        refresh
      );
    };
  }, [loadCount]);

  if (count <= 0) {
    return null;
  }

  return (
    <span
      className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[8px] font-black leading-none text-white"
      aria-label={`${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`}
    >
      {count > 99
        ? '99+'
        : count}
    </span>
  );
}
