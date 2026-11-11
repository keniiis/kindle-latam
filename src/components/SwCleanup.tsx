"use client";

import { useEffect } from "react";

/** La web ya no es una PWA: elimina el service worker y las cachés que haya dejado una visita anterior. */
export default function SwCleanup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .then(() => ("caches" in window ? caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))) : undefined))
      .catch(() => { });
  }, []);
  return null;
}
