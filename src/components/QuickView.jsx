import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { priceOf, formatPeso } from '../lib/api.js'
import { useCart, useWishlist } from '../hooks/use-session-stores.jsx'
import { Heart, X, Shield, Truck, Refresh } from './Icons.jsx'
import Stars from './Stars.jsx'

export default function QuickView({ product, onClose }) {
  const { add } = useCart()
  const { has: inWish, toggle: toggleWish } = useWishlist()
  const [idx, setIdx] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null
  const price = priceOf(product)
  const onSale = product.sale_price != null && product.sale_price < product.price
  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-2xl bg-card p-6 shadow-2xl outline-none"
      >
        <div className="flex items-start justify-between">
          <p className="text-[11px] uppercase tracking-wide text-mute">{product.brand}</p>
          <button type="button" onClick={onClose} aria-label="Close quick view" className="rounded-full p-1 text-mute hover:text-ink">
            <X />
          </button>
        </div>

        <div className="mt-3 grid gap-6 md:grid-cols-2">
          <div>
            <img src={imgs[idx]} alt={product.name} className="aspect-square w-full rounded-xl object-cover" />
            {imgs.length > 1 && (
              <div className="mt-2 flex gap-2">
                {imgs.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    className={`h-14 w-14 overflow-hidden rounded-lg ring-2 ${i === idx ? 'ring-volt' : 'ring-line'}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <div className="mt-2">
              <Stars value={product.rating} count={product.rating_count} />
            </div>
            <p className="mt-3 text-sm text-mute">{product.description}</p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{formatPeso(price)}</span>
              {onSale && <span className="text-mute line-through">{formatPeso(product.price)}</span>}
            </div>

            {product.specs && (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {Object.entries(product.specs).slice(0, 6).map(([k, v]) => (
                  <div key={k} className="col-span-1">
                    <dt className="text-mute">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => add(product.id)} className="rounded-xl bg-volt px-5 py-2.5 font-semibold text-white hover:bg-volt-deep">
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 ring-1 ring-line ${inWish(product.id) ? 'text-rose-500' : 'text-ink hover:text-rose-500'}`}
                aria-pressed={inWish(product.id)}
              >
                <Heart filled={inWish(product.id)} /> {inWish(product.id) ? 'Saved' : 'Save'}
              </button>
              <Link to={`/product/${product.slug}`} className="rounded-xl px-4 py-2.5 font-medium text-volt ring-1 ring-volt/40 hover:bg-volt/5">
                Full details
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-mute">
              <span className="flex items-center gap-1.5"><Truck /> Ships in 1-2 days</span>
              <span className="flex items-center gap-1.5"><Shield /> 2 year warranty</span>
              <span className="flex items-center gap-1.5"><Refresh /> 7 day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
