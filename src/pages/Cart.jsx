import { Link } from 'react-router-dom'
import { useCart, useToast } from '../hooks/use-session-stores.jsx'
import { listProducts, priceOf, formatPeso } from '../lib/api.js'; void priceOf; void formatPeso
import { useEffect, useState } from 'react'

export default function Cart() {
  const cart = useCart()
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    listProducts().then(setProducts).catch(() => {})
  }, [])

  useEffect(() => {
    setRows(cart.items.map((it) => ({ ...it, product: products.find((p) => p.id === it.id) })).filter((r) => r.product))
  }, [cart.items, products])

  const total = rows.reduce((n, r) => n + (r.product.sale_price ?? r.product.price) * r.qty, 0)
  const count = rows.reduce((n, r) => n + r.qty, 0)

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-mute">Gadgets you add will wait here for you.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-xl bg-volt px-5 py-3 font-semibold text-white hover:bg-volt-deep">Browse the shop</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold">Cart</h1>
      <p className="text-mute">{count} item{count === 1 ? '' : 's'}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
          {rows.map(({ product: p, qty, id }) => (
            <li key={id} className="flex items-center gap-4 p-4">
              <img src={p.images?.[0]} alt="" className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <Link to={`/product/${p.slug}`} className="font-medium hover:text-volt">{p.name}</Link>
                <p className="text-sm text-mute">{p.brand}</p>
                <button
                  type="button"
                  onClick={() => cart.remove(id)}
                  className="mt-1 text-xs text-muted hover:text-rose-500"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cart.setQty(id, qty - 1)}
                  aria-label={`Decrease quantity of ${p.name}`}
                  className="h-8 w-8 rounded-lg bg-paper font-bold ring-1 ring-line"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => cart.setQty(id, qty + 1)}
                  aria-label={`Increase quantity of ${p.name}`}
                  className="h-8 w-8 rounded-lg bg-paper font-bold ring-1 ring-line"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-semibold">
                {formatPeso((p.sale_price ?? p.price) * qty)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl bg-card p-6 ring-1 ring-line lg:sticky lg:top-20">
          <h2 className="font-bold">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd className="font-medium">{formatPeso(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-mute">Shipping</dt><dd className="font-medium text-good">{total >= 1500 ? 'Free' : formatPeso(150)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base"><dt className="font-semibold">Total</dt><dd className="font-bold">{formatPeso(total + (total >= 1500 ? 0 : 150))}</dd></div>
          </dl>
          <button
            type="button"
            onClick={() => toast.push('Payments are coming soon. Your cart is saved locally in the meantime.', 'rose')}
            className="mt-5 w-full rounded-xl bg-volt py-3 font-semibold text-white hover:bg-volt-deep"
          >
            Checkout
          </button>
          <p className="mt-2 text-center text-xs text-mute">Payments land in a future release.</p>
        </aside>
      </div>
    </div>
  )
}
