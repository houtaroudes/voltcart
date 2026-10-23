import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

/**
 * Session stores for cart, wishlist, compare and recently viewed, all
 * persisted to localStorage. One provider, one toast queue. Kept in a single
 * small module because every piece is the same shape: id-keyed local state.
 */

const CartContext = createContext(null)
const WishContext = createContext(null)
const CompareContext = createContext(null)
const RecentContext = createContext(null)
const ToastContext = createContext(null)

function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable: state still works in memory */
    }
  }, [key, value])
  return [value, setValue]
}

let toastSeq = 0

export function StoresProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((message, tone = 'volt') => {
    const id = ++toastSeq
    setToasts((t) => [...t.slice(-3), { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const [cart, setCart] = usePersisted('voltcart.cart', []) // [{id, qty}]
  const [wishlist, setWishlist] = usePersisted('voltcart.wishlist', []) // [id]
  const [compare, setCompare] = usePersisted('voltcart.compare', []) // [id]
  const [recent, setRecent] = usePersisted('voltcart.recent', []) // [slug]

  const cartApi = useMemo(
    () => ({
      items: cart,
      add: (id, qty = 1) => {
        setCart((c) => {
          const hit = c.find((x) => x.id === id)
          return hit ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x)) : [...c, { id, qty }]
        })
        pushToast('Added to cart')
      },
      setQty: (id, qty) => setCart((c) => (qty < 1 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty } : x)))),
      remove: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      clear: () => setCart([]),
      count: cart.reduce((n, x) => n + x.qty, 0),
    }),
    [cart, setCart, pushToast],
  )

  const wishApi = useMemo(
    () => ({
      ids: wishlist,
      has: (id) => wishlist.includes(id),
      toggle: (id) => {
        setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
        pushToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist', 'rose')
      },
    }),
    [wishlist, setWishlist, pushToast],
  )

  const compareApi = useMemo(
    () => ({
      ids: compare,
      has: (id) => compare.includes(id),
      toggle: (id) => {
        setCompare((c) => {
          if (c.includes(id)) return c.filter((x) => x !== id)
          if (c.length >= 3) return c
          return [...c, id]
        })
        pushToast(compare.length >= 3 && !compare.includes(id) ? 'Compare is full (3 max)' : 'Added to compare', 'cyan')
      },
      // Replace the whole set in one go, for compare state carried in a URL.
      set: (ids) => setCompare([...new Set(ids)].slice(0, 3)),
      clear: () => setCompare([]),
    }),
    [compare, setCompare, pushToast],
  )

  const recentApi = useMemo(
    () => ({
      slugs: recent,
      push: (slug) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 6)),
    }),
    [recent, setRecent],
  )

  const toastApi = useMemo(() => ({ push: pushToast }), [pushToast])

  return (
    <CartContext.Provider value={cartApi}>
      <WishContext.Provider value={wishApi}>
        <CompareContext.Provider value={compareApi}>
          <RecentContext.Provider value={recentApi}>
            <ToastContext.Provider value={toastApi}>
              {children}
              <ToastStack toasts={toasts} />
            </ToastContext.Provider>
          </RecentContext.Provider>
        </CompareContext.Provider>
      </WishContext.Provider>
    </CartContext.Provider>
  )
}

const toneClass = {
  volt: 'toast',
  rose: 'toast toast--error',
  error: 'toast toast--error',
  cyan: 'toast',
}

function ToastStack({ toasts }) {
  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-[500] flex max-w-[min(92vw,26rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={toneClass[t.tone] ?? toneClass.volt}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

export const useCart = () => useContext(CartContext)
export const useWishlist = () => useContext(WishContext)
export const useCompare = () => useContext(CompareContext)
export const useRecent = () => useContext(RecentContext)
export const useToast = () => useContext(ToastContext)
