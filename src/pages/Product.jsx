import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, listRelated, priceOf, formatPeso } from '../lib/api.js'
import { previewUrl, copyText } from '../lib/share.js'
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
      <div className="container py-24">
        <h1 className="font-display text-section">Product not found</h1>
        <p className="mt-3 max-w-[52ch] text-muted">It may be out of the catalog. The collection is one link away.</p>
        <Link to="/shop" className="btn btn--primary mt-8">
          Back to shop
        </Link>
      </div>
    )
  }

  if (!p) {
    return (
      <div className="container py-10">
        <div className="grid animate-pulse gap-10 md:grid-cols-2">
          <div className="aspect-[4/5] border-2 border-ink bg-paper-2" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-paper-2" />
            <div className="h-4 w-1/2 bg-paper-2" />
            <div className="h-28 bg-paper-2" />
          </div>
        </div>
      </div>
    )
  }

  const price = priceOf(p)
  const onSale = p.sale_price != null && p.sale_price < p.price
  const imgs = p.images?.length ? p.images : ['https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80&auto=format&fit=crop']

  const shareLink = async () => {
    const url = previewUrl(p.slug)
    const ok = await copyText(url)
    toast.push(ok ? 'Link copied. It opens this product in a preview.' : `Copy failed. The link is ${url}`, ok ? 'cyan' : 'error')
  }

  return (
    <div className="container py-8">
      <nav className="flex flex-wrap items-baseline gap-2 border-b border-rule pb-3 text-sm text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink hover:underline hover:decoration-accent hover:underline-offset-4">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${p.category}`} className="capitalize hover:text-ink hover:underline hover:decoration-accent hover:underline-offset-4">
          {p.category.replace('-', ' ')}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div>
          <img
            src={imgs[idx]}
            alt={p.name}
            width="900"
            height="1125"
            fetchPriority="high"
            className="aspect-[4/5] w-full border-2 border-ink bg-paper-2 object-cover"
          />
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-2">
              {imgs.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Show image ${i + 1} of ${p.name}`}
                  aria-pressed={i === idx}
                  className={`border-2 ${i === idx ? 'border-ink' : 'border-rule'} bg-paper-2`}
                >
                  <img src={src} alt="" width="80" height="80" loading="lazy" className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted">{p.brand}</p>
          <h1 className="mt-2 font-display text-display-s">{p.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Stars value={p.rating} count={p.rating_count} />
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Eye />
              {p.viewing} viewing now
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-t border-rule pt-5">
            <span className="code text-[clamp(2rem,3.5vw,2.75rem)] leading-none">{formatPeso(price)}</span>
            {onSale && (
              <>
                <s className="code text-lg text-muted">{formatPeso(p.price)}</s>
                <span className="chip chip--signal">Save {formatPeso(p.price - p.sale_price)}</span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-[58ch] text-muted">{p.description}</p>

          {p.specs && Object.keys(p.specs).length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-lg">Key specs</h2>
              <dl className="mt-3 border-t-2 border-ink">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-rule py-2.5 text-sm">
                    <dt className="capitalize text-muted">{k.replace(/[-_]/g, ' ')}</dt>
                    <dd className="text-right font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" disabled={p.stock <= 0} onClick={() => add(p.id)} className="btn btn--primary">
              {p.stock > 0 ? 'Add to cart' : 'Sold out'}
            </button>
            <button
              type="button"
              onClick={() => toggleWish(p.id)}
              aria-pressed={inWish(p.id)}
              className={`btn btn--second ${inWish(p.id) ? 'bg-accent-soft' : ''}`}
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
              aria-pressed={inCompare(p.id)}
              className={`btn btn--second ${inCompare(p.id) ? 'bg-accent-soft' : ''}`}
            >
              <Scale /> {inCompare(p.id) ? 'In compare' : 'Compare'}
            </button>
            <button type="button" onClick={shareLink} className="btn btn--second">
              Copy link
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Truck /> Ships in 1-2 days</span>
            <span className="flex items-center gap-1.5"><Shield /> 2 year warranty</span>
            <span className="flex items-center gap-1.5"><Refresh /> 7 day returns</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section--tight">
          <h2 className="border-b-2 border-ink pb-4 font-display text-section capitalize">More in {p.category.replace('-', ' ')}</h2>
          <div className="rail mt-8">
            {related.map((r, i) => (
              <div key={r.id} className={i === 0 ? 'w-[21rem]' : 'w-[17rem]'}>
                <ProductCard product={r} onQuickView={setQv} />
              </div>
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
