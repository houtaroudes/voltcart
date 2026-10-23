import { Link } from 'react-router-dom'
import { useCart, useToast } from '../hooks/use-session-stores.jsx'
import { listProducts, formatPeso } from '../lib/api.js'
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
      <div className="container py-16">
        <h1 className="max-w-[16ch] font-display text-section">Your cart is empty</h1>
        <div className="mt-8 grid gap-8 border-t-2 border-ink pt-6 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="max-w-[46ch] text-muted">Gadgets you add will wait here for you.</p>
            <Link to="/shop" className="btn btn--primary mt-6">
              Browse the shop
            </Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="font-medium">Shipping</dt>
              <dd className="mt-1 text-sm text-muted">Free over P1,500</dd>
            </div>
            <div>
              <dt className="font-medium">Warranty</dt>
              <dd className="mt-1 text-sm text-muted">2 years</dd>
            </div>
            <div>
              <dt className="font-medium">Returns</dt>
              <dd className="mt-1 text-sm text-muted">7 days</dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-4">
        <h1 className="font-display text-section">Cart</h1>
        <p className="code text-sm text-muted">
          {count} item{count === 1 ? '' : 's'}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul>
          {rows.map(({ product: p, qty, id }) => (
            <li key={id} className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-5 border-b border-rule py-5 sm:grid-cols-[80px_minmax(0,1fr)_auto_auto]">
              <img
                src={p.images?.[0]}
                alt=""
                width="80"
                height="80"
                loading="lazy"
                className="h-20 w-20 border-2 border-ink object-cover"
              />
              <div className="min-w-0">
                <Link to={`/product/${p.slug}`} className="font-display text-lg leading-tight hover:underline hover:decoration-accent hover:underline-offset-4">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm text-muted">{p.brand}</p>
                <button type="button" onClick={() => cart.remove(id)} className="mt-2 text-sm text-muted underline decoration-rule underline-offset-4 hover:text-accent hover:decoration-accent">
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => cart.setQty(id, qty - 1)} aria-label={`Decrease quantity of ${p.name}`} className="qty">
                  -
                </button>
                <span className="code w-8 text-center">{qty}</span>
                <button type="button" onClick={() => cart.setQty(id, qty + 1)} aria-label={`Increase quantity of ${p.name}`} className="qty">
                  +
                </button>
              </div>
              <p className="code text-right sm:min-w-24">{formatPeso((p.sale_price ?? p.price) * qty)}</p>
            </li>
          ))}
        </ul>

        <aside className="plate h-fit p-6 lg:sticky lg:top-[88px]">
          <h2 className="font-display text-lg">Summary</h2>
          <dl className="mt-4 text-sm">
            <div className="flex justify-between border-b border-rule py-2">
              <dt className="text-muted">Subtotal</dt>
              <dd className="code">{formatPeso(total)}</dd>
            </div>
            <div className="flex justify-between border-b border-rule py-2">
              <dt className="text-muted">Shipping</dt>
              <dd className="code">{total >= 1500 ? 'Free' : formatPeso(150)}</dd>
            </div>
            <div className="flex justify-between py-3 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="code font-medium">{formatPeso(total + (total >= 1500 ? 0 : 150))}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => toast.push('Payments are coming soon. Your cart is saved locally in the meantime.', 'rose')}
            className="btn btn--primary mt-4 w-full"
          >
            Checkout
          </button>
          <p className="mt-3 text-sm text-muted">Payments land in a future release.</p>
        </aside>
      </div>
    </div>
  )
}
