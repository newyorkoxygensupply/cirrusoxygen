"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { slug: string; name: string; price: number; qty: number };

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cirrus-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount, not a derived-state sync
    setLines(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((item: Omit<CartLine, "qty">, qty: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === item.slug);
      if (existing) {
        return prev.map((l) => (l.slug === item.slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    return lines.reduce(
      (acc, l) => ({ count: acc.count + l.qty, subtotal: acc.subtotal + l.qty * l.price }),
      { count: 0, subtotal: 0 },
    );
  }, [lines]);

  const value = useMemo(
    () => ({ lines, addItem, removeItem, setQty, clear, count, subtotal }),
    [lines, addItem, removeItem, setQty, clear, count, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
