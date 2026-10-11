import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, listRelated, priceOf, formatPeso } from '../lib/api.js'
import { useCart, useWishlist, useCompare, useRecent, useToast } from '../hooks/use-session-stores.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import Stars from '../components/Stars.jsx'
import { Heart, Eye, Scale, Truck, Shield, Refresh } from '../components/Icons.jsx'

export default function Product() {
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [related, setRelated] = useState([])
  const [idx, setIdx] = useState(0)
  const [qv, setQv] = useState(null)
  const [miss, setMiss] = useState(false)
  const { add } = useCart()
  const { has: inWish, toggle: toggleWish } = useWishlist()
  const { has: inCompare, toggle: toggleCompare } = useCompare()
  const recent = useRecent()
  const toast = useToast()

  useEffect(() => {
    let dead = false
    setP(null)
    setMiss(false)
    getProduct(slug)
      .then((prod) => {
        if (dead) return
        setP(prod)
        recent.push(slug)
        listRelated(prod.category, slug).then(setRelated).catch(() => {})
      })
      .catch(() => !dead && setMiss(true))
    return () => {
      dead = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (miss) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-mute">It may be out of the catalog. The collection is one click away.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-xl bg-volt px-5 py-3 font-semibold text-white">Back to shop</Link>
      </div>
    )
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid animate-pulse gap-6 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-card ring-1 ring-line" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-card" />
            <div className="h-4 w-1/2 rounded bg-card" />
            <div className="h-24 rounded bg-card" />
          </div>
        </div>
      </div>
    )
  }

  const price = priceOf(p)
  const onSale = p.sale_price != null && p.sale_price < p.price
  const imgs = p.images?.length ? p.images : ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop']

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-sm text-mute" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-volt">Home</Link> /{' '}
        <Link to={`/shop?category=${p.category}`} className="hover:text-volt capitalize">{p.category.replace('-', ' ')}</Link> /{' '}
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div>
          <img src={imgs[idx]} alt={p.name} className="aspect-square w-full rounded-2xl object-cover ring-1 ring-line" />
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-2">
              {imgs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-16 w-16 overflow-hidden rounded-lg ring-2 ${i === idx ? 'ring-volt' : 'ring-line'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-mute">{p.brand}</p>
          <h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
          <div className="mt-3 flex items-center gap-4">
            <Stars value={p.rating} count={p.rating_count} />
            <span className="flex items-center gap-1 text-xs text-rose-500"><Eye /> {p.viewing} viewing now</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatPeso(price)}</span>
            {onSale && (
              <>
                <span className="text-lg text-mute line-through">{formatPeso(p.price)}</span>
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                  Save {formatPeso(p.price - p.sale_price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-mute">{p.description}</p>

          {p.specs && Object.keys(p.specs).length > 0 && (
            <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-line">
              <h2 className="font-semibold">Key specs</h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-mute capitalize">{k.replace(/[-_]/g, ' ')}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={p.stock <= 0}
              onClick={() => add(p.id)}
              className="rounded-xl bg-volt px-6 py-3 font-semibold text-white hover:bg-volt-deep disabled:opacity-40"
            >
              {p.stock > 0 ? 'Add to cart' : 'Sold out'}
            </button>
            <button
              type="button"
              onClick={() => toggleWish(p.id)}
              aria-pressed={inWish(p.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 ring-1 ring-line ${inWish(p.id) ? 'text-rose-500' : 'hover:text-rose-500'}`}
            >
              <Heart filled={inWish(p.id)} /> {inWish(p.id) ? 'Saved' : 'Wishlist'}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleCompare(p.id)
                if (inCompare(p.id)) {
                  toast.push('Open the compare drawer at the bottom to see specs side by side.', 'cyan')
                }
              }}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 ring-1 ring-line ${inCompare(p.id) ? 'bg-surge/20 text-volt-deep' : 'hover:text-volt'}`}
            >
              <Scale /> {inCompare(p.id) ? 'In compare' : 'Compare'}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-mute">
            <span className="flex items-center gap-1.5"><Truck /> Ships in 1-2 days</span>
            <span className="flex items-center gap-1.5"><Shield /> 2 year warranty</span>
            <span className="flex items-center gap-1.5"><Refresh /> 7 day returns</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">More in {p.category.replace('-', ' ')}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} onQuickView={setQv} />
            ))}
          </div>
        </section>
      )}

      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
      <CompareDrawer />
    </div>
  )
}

/* Renders at the bottom wherever compare items are pinned (Home/Shop render it via App shell). */
function CompareDrawer() {
  return null
}
