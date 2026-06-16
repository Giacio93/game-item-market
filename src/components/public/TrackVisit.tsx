'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const VISITOR_ID_KEY = 'game_item_market_visitor_id';
const TRACKED_SESSION_PREFIX = 'game_item_market_tracked';

function createVisitorId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateVisitorId() {
  const existingVisitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const visitorId = createVisitorId();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);

  return visitorId;
}

export function TrackVisit() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    const sessionKey = `${TRACKED_SESSION_PREFIX}:${pathname}`;

    if (sessionStorage.getItem(sessionKey)) {
      return;
    }

    sessionStorage.setItem(sessionKey, 'true');

    fetch('/api/track-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        path: pathname,
      }),
      keepalive: true,
    }).catch(() => {
      sessionStorage.removeItem(sessionKey);
    });
  }, [pathname]);

  return null;
}