import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist, useCart, useCompare } from '../hooks/use-session-stores.jsx'
import { listProducts, priceOf, formatPeso } from '../lib/api.js'
import { Scale } from '../components/Icons.jsx'

export default function Wishlist() {
  const wish = useWishlist()
  const cart = useCart()
  const compare = useCompare()
  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    listProducts().then((rows) => {
      setProducts(rows)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const saved = products.filter((p) => wish.ids.includes(p.id))

  if (loaded && saved.length === 0) {
    return (
      <div className="container py-16">
        <h1 className="font-display text-section">Wishlist</h1>
        <div className="mt-8 grid gap-8 border-t-2 border-ink pt-6 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-display text-title">No saved gadgets yet</p>
            <p className="mt-2 max-w-[46ch] text-muted">Tap the heart on anything you like and it will wait here.</p>
          </div>
          <div>
            <Link to="/shop" className="btn btn--primary">
              Find something to save
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-4">
        <h1 className="font-display text-section">Wishlist</h1>
        <p className="code text-sm text-muted">
          {saved.length} saved item{saved.length === 1 ? '' : 's'}
        </p>
      </div>

      <ul className="mt-2">
        {saved.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-5 border-b border-rule py-5">
            <img
              src={p.images?.[0]}
              alt=""
              width="80"
              height="80"
              loading="lazy"
              className="h-20 w-20 border-2 border-ink object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link to={`/product/${p.slug}`} className="font-display text-lg leading-tight hover:underline hover:decoration-accent hover:underline-offset-4">
                {p.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {p.brand}
                <span className="code ml-2 text-ink">{formatPeso(priceOf(p))}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  cart.add(p.id)
                  wish.toggle(p.id)
                }}
                className="btn btn--primary btn--sm"
              >
                Move to cart
              </button>
              <button
                type="button"
                onClick={() => compare.toggle(p.id)}
                aria-pressed={compare.has(p.id)}
                aria-label={compare.has(p.id) ? `Remove ${p.name} from compare` : `Add ${p.name} to compare`}
                className={`grid h-10 w-10 place-items-center border border-ink ${compare.has(p.id) ? 'bg-accent-soft' : 'hover:bg-paper-2'}`}
              >
                <Scale />
              </button>
              <button type="button" onClick={() => wish.toggle(p.id)} className="btn btn--second btn--sm">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {saved.length > 0 && (
        <button
          type="button"
          onClick={() => saved.forEach((p) => cart.add(p.id))}
          className="btn btn--second mt-8"
        >
          Add all to cart
        </button>
      )}
    </div>
  )
}
