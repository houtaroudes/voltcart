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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">No saved gadgets yet</h1>
        <p className="mt-2 text-mute">Tap the heart on anything you like and it will wait here.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-xl bg-volt px-5 py-3 font-semibold text-white hover:bg-volt-deep">Find something to save</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <p className="text-mute">{saved.length} saved item{saved.length === 1 ? '' : 's'}</p>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
        {saved.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
            <img src={p.images?.[0]} alt="" className="h-20 w-20 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <Link to={`/product/${p.slug}`} className="font-medium hover:text-volt">{p.name}</Link>
              <p className="text-sm text-mute">{p.brand} - {formatPeso(priceOf(p))}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => cart.add(p.id)}
                className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-volt-deep"
              >
                Move to cart
              </button>
              <button
                type="button"
                onClick={() => compare.has(p.id) || compare.ids.length >= 3 ? null : compare.toggle(p.id)}
                aria-label={`Add ${p.name} to compare`}
                className="rounded-xl p-2.5 ring-1 ring-line text-mute hover:text-volt"
              >
                <Scale />
              </button>
              <button
                type="button"
                onClick={() => wish.toggle(p.id)}
                className="rounded-xl px-3 py-2 text-sm text-rose-500 ring-1 ring-rose-200 hover:bg-rose-50"
              >
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
          className="mt-6 rounded-xl bg-volt px-5 py-3 font-semibold text-white hover:bg-volt-deep"
        >
          Add all to cart
        </button>
      )}
    </div>
  )
}
