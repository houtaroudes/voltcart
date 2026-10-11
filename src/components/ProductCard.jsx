import { Link } from 'react-router-dom'
import { priceOf, formatPeso } from '../lib/api.js'
import { useWishlist, useCompare, useCart } from '../hooks/use-session-stores.jsx'
import { Heart, Eye, Scale, Bolt } from './Icons.jsx'
import Stars from './Stars.jsx'
import QuickView from './QuickView.jsx'

export default function ProductCard({ product, onQuickView }) {
  const { has: inWish, toggle: toggleWish } = useWishlist()
  const { has: inCompare, toggle: toggleCompare } = useCompare()
  const { add } = useCart()
  const price = priceOf(product)
  const onSale = product.sale_price != null && product.sale_price < product.price
  const off = onSale ? Math.round((1 - product.sale_price / product.price) * 100) : 0

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-card transition-shadow duration-200 hover:shadow-xl ${
        product.sponsored ? 'ring-2 ring-volt/60 shadow-[0_0_14px_rgba(124,58,237,0.35)]' : 'ring-1 ring-line'
      }`}
    >
      {product.sponsored && (
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-volt px-2.5 py-1 text-[11px] font-semibold text-white shadow">
          <Bolt /> Sponsored
        </span>
      )}
      {onSale && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white">
          -{off}%
        </span>
      )}

      <button
        type="button"
        onClick={() => onQuickView?.(product)}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-white"
        aria-label={`Quick view ${product.name}`}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink/70 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Eye /> Quick view
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-mute">{product.brand}</p>
            <Link to={`/product/${product.slug}`} className="font-medium hover:text-volt">
              {product.name}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => toggleWish(product.id)}
            aria-pressed={inWish(product.id)}
            aria-label={inWish(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`rounded-full p-1.5 transition-colors ${inWish(product.id) ? 'text-rose-500' : 'text-mute hover:text-rose-500'}`}
          >
            <Heart filled={inWish(product.id)} />
          </button>
        </div>

        <Stars value={product.rating} count={product.rating_count} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <span className="text-lg font-semibold">{formatPeso(price)}</span>
            {onSale && <span className="ml-2 text-sm text-mute line-through">{formatPeso(product.price)}</span>}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-pressed={inCompare(product.id)}
              aria-label={inCompare(product.id) ? 'Remove from compare' : 'Add to compare'}
              className={`rounded-lg p-2 ring-1 transition-colors ${inCompare(product.id) ? 'bg-surge/20 text-volt-deep ring-surge' : 'ring-line text-mute hover:text-volt'}`}
            >
              <Scale />
            </button>
            <button
              type="button"
              onClick={() => add(product.id)}
              className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white hover:bg-volt-deep"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export { QuickView }
