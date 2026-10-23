import { Link } from 'react-router-dom'
import { priceOf, formatPeso } from '../lib/api.js'
import { useWishlist, useCompare, useCart } from '../hooks/use-session-stores.jsx'
import { Heart, Scale } from './Icons.jsx'
import Stars from './Stars.jsx'
import QuickView from './QuickView.jsx'

export default function ProductCard({ product, onQuickView, eager = false }) {
  const { has: inWish, toggle: toggleWish } = useWishlist()
  const { has: inCompare, toggle: toggleCompare } = useCompare()
  const { add } = useCart()
  const price = priceOf(product)
  const onSale = product.sale_price != null && product.sale_price < product.price
  const off = onSale ? Math.round((1 - product.sale_price / product.price) * 100) : 0

  return (
    <article className="plate plate-link flex flex-col">
      <button
        type="button"
        onClick={() => onQuickView?.(product)}
        className="block w-full cursor-pointer overflow-hidden border-b-2 border-ink bg-paper-2"
        aria-label={`Quick view: ${product.name}`}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          width="800"
          height="600"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          className="aspect-[4/3] w-full object-cover"
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-muted">{product.brand}</p>
          <div className="flex items-center gap-1.5">
            {product.sponsored && <span className="chip">Sponsored</span>}
            {onSale && <span className="chip chip--fill">-{off}%</span>}
            <button
              type="button"
              onClick={() => toggleWish(product.id)}
              aria-pressed={inWish(product.id)}
              aria-label={inWish(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              className={`grid h-7 w-7 place-items-center border border-ink transition-colors duration-[var(--dur-micro)] ${
                inWish(product.id) ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-2'
              }`}
            >
              <Heart filled={inWish(product.id)} />
            </button>
          </div>
        </div>

        <h3 className="font-display text-lg leading-tight">
          <Link to={`/product/${product.slug}`} className="hover:underline hover:decoration-accent hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>

        <Stars value={product.rating} count={product.rating_count} />

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <p className="flex items-baseline gap-2">
            <span className="code text-lg">{formatPeso(price)}</span>
            {onSale && <s className="code text-sm text-muted">{formatPeso(product.price)}</s>}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-pressed={inCompare(product.id)}
              aria-label={inCompare(product.id) ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
              className={`grid h-10 w-10 place-items-center border border-ink transition-colors duration-[var(--dur-micro)] ${
                inCompare(product.id) ? 'bg-accent-soft text-accent' : 'text-ink hover:bg-paper-2'
              }`}
            >
              <Scale />
            </button>
            <button type="button" onClick={() => add(product.id)} className="btn btn--primary btn--sm">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export { QuickView }
