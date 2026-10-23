import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { priceOf, formatPeso } from '../lib/api.js'
import { useCart, useWishlist, useToast } from '../hooks/use-session-stores.jsx'
import { previewUrl, copyText } from '../lib/share.js'
import { Heart, X, Shield, Truck, Refresh } from './Icons.jsx'
import Stars from './Stars.jsx'

export default function QuickView({ product, onClose, shareUrl }) {
  const { add } = useCart()
  const { has: inWish, toggle: toggleWish } = useWishlist()
  const toast = useToast()
  const [idx, setIdx] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null
  const share = async () => {
    // On a shared preview the link should carry the comparison, not just this product.
    const url = shareUrl ?? previewUrl(product.slug)
    const ok = await copyText(url)
    toast.push(ok ? 'Link copied. It opens this product in a preview.' : `Copy failed. The link is ${url}`, ok ? 'cyan' : 'error')
  }
  const price = priceOf(product)
  const onSale = product.sale_price != null && product.sale_price < product.price
  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop']

  return (
    <div className="modal-scrim fixed inset-0 z-[400] flex items-center justify-center p-4" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="plate max-h-[88vh] w-full max-w-3xl overflow-auto p-6 outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule pb-3">
          <p className="text-sm text-muted">{product.brand}</p>
          <button type="button" onClick={onClose} aria-label="Close quick view" className="p-1 text-ink hover:text-accent">
            <X />
          </button>
        </div>

        <div className="mt-5 grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={imgs[idx]}
              alt={product.name}
              width="800"
              height="1000"
              className="aspect-[4/5] w-full border-2 border-ink bg-paper-2 object-cover"
            />
            {imgs.length > 1 && (
              <div className="mt-2 flex gap-2">
                {imgs.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`Show image ${i + 1} of ${product.name}`}
                    aria-pressed={i === idx}
                    className={`border-2 ${i === idx ? 'border-ink' : 'border-rule'}`}
                  >
                    <img src={src} alt="" width="64" height="64" loading="lazy" className="h-16 w-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="font-display text-title">{product.name}</h2>
            <div className="mt-2">
              <Stars value={product.rating} count={product.rating_count} />
            </div>
            <p className="mt-3 text-sm text-muted">{product.description}</p>

            <div className="mt-4 flex items-baseline gap-3 border-t border-rule pt-3">
              <span className="code text-2xl">{formatPeso(price)}</span>
              {onSale && <s className="code text-sm text-muted">{formatPeso(product.price)}</s>}
            </div>

            {product.specs && (
              <dl className="mt-4 border-t border-rule">
                {Object.entries(product.specs).slice(0, 6).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-rule py-2 text-sm">
                    <dt className="capitalize text-muted">{k.replace(/[-_]/g, ' ')}</dt>
                    <dd className="text-right font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => add(product.id)} className="btn btn--primary">
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => toggleWish(product.id)}
                aria-pressed={inWish(product.id)}
                className={`btn btn--second ${inWish(product.id) ? 'bg-accent-soft' : ''}`}
              >
                <Heart filled={inWish(product.id)} /> {inWish(product.id) ? 'Saved' : 'Save'}
              </button>
              <button type="button" onClick={share} className="btn btn--second">
                Copy link
              </button>
              <Link to={`/product/${product.slug}`} className="btn btn--second">
                Full details
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-3 text-sm text-muted">
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
