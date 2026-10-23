import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts, listDeals, listCategories, listBestSellers, listFeatured, priceOf, formatPeso } from '../lib/api.js'
import DealZone from '../components/DealZone.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import Stars from '../components/Stars.jsx'

const categoryLabel = (cats, slug) => cats.find((c) => c.slug === slug)?.name ?? slug.replace('-', ' ')

export default function Home() {
  const [deals, setDeals] = useState([])
  const [cats, setCats] = useState([])
  const [all, setAll] = useState([])
  const [featured, setFeatured] = useState([])
  const [best, setBest] = useState([])
  const [qv, setQv] = useState(null)
  const [pick, setPick] = useState(0)

  useEffect(() => {
    listDeals().then(setDeals).catch(() => {})
    listCategories().then(setCats).catch(() => {})
    listProducts().then(setAll).catch(() => {})
    listFeatured(8).then(setFeatured).catch(() => {})
    listBestSellers(4).then(setBest).catch(() => {})
  }, [])

  const lead = featured.slice(0, 5)
  const cover = lead[pick] ?? lead[0]
  const countOf = (slug) => all.filter((p) => p.category === slug).length

  return (
    <div>
      {/* Cover hero: the featured product fills the plate, the catalog follows. */}
      <section className="border-b-2 border-ink">
        <div className="container grid grid-cols-1 gap-10 pb-16 pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-24">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="font-display text-display-s">Gear that keeps up with you</h1>
            <p className="lead mt-5">Phones, audio, wearables and smart home, specs and price on one page.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn--primary">
                Shop the collection
              </Link>
              <Link to="/shop?category=audio" className="btn btn--second">
                Audio deals
              </Link>
            </div>
            <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-rule pt-4 text-sm">
              <div>
                <dt className="text-muted">Shipping</dt>
                <dd className="mt-1">Free over P1,500</dd>
              </div>
              <div>
                <dt className="text-muted">Warranty</dt>
                <dd className="mt-1">2 years</dd>
              </div>
              <div>
                <dt className="text-muted">Returns</dt>
                <dd className="mt-1">7 days</dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <figure className="plate">
              <div className="relative">
                {cover ? (
                  <img
                    src={cover.images?.[0]}
                    alt={cover.name}
                    width="1200"
                    height="900"
                    fetchPriority={pick === 0 ? 'high' : 'auto'}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full animate-pulse bg-paper-2" aria-hidden="true" />
                )}
                <span className="cover-tag code">{cover ? 'Featured' : 'Loading'}</span>
              </div>

              <figcaption className="flex flex-wrap items-end justify-between gap-4 border-t-2 border-ink px-5 py-4">
                {cover ? (
                  <>
                    <div className="min-w-0">
                      <p className="text-sm text-muted">
                        {cover.brand} · {categoryLabel(cats, cover.category)}
                      </p>
                      <p className="mt-1 font-display text-xl leading-tight">{cover.name}</p>
                      <div className="mt-1.5">
                        <Stars value={cover.rating} count={cover.rating_count} />
                      </div>
                    </div>
                    <Link to={`/product/${cover.slug}`} className="btn btn--second btn--sm shrink-0">
                      See the specs
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted">Loading the collection</p>
                )}
              </figcaption>

              {lead.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-rule px-5 py-3" role="group" aria-label="More from the collection">
                  {lead.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPick(i)}
                      aria-pressed={i === pick}
                      aria-label={`Show ${p.name} on the cover`}
                      className={`shrink-0 border-2 bg-paper-2 transition-colors ${i === pick ? 'border-accent' : 'border-rule hover:border-ink'}`}
                    >
                      <img src={p.images?.[0]} alt="" width="56" height="56" loading="lazy" className="h-14 w-14 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </figure>
          </div>
        </div>
      </section>

      <div className="pt-0">
        <DealZone deals={deals} />
      </div>

      {/* The range, by family. */}
      <section className="section">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-section">Shop by category</h2>
              <p className="mt-3 max-w-[42ch] text-muted">Find your next upgrade in a few clicks.</p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 gap-0 border-t-2 border-ink sm:grid-cols-3">
                {cats.map((c) => (
                  <li key={c.slug} className="border-b border-rule">
                    <Link to={`/shop?category=${c.slug}`} className="block px-3 py-4 hover:bg-accent-soft">
                      <span className="font-display text-lg leading-tight">{c.name}</span>
                      <span className="code mt-1 block text-sm text-muted">{countOf(c.slug)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The range itself. */}
      <section className="section--tight">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
            <div>
              <h2 className="font-display text-section">Hot right now</h2>
              <p className="mt-3 text-muted">What everyone is eyeing this week.</p>
            </div>
            <Link to="/shop" className="text-sm font-medium underline decoration-ink underline-offset-4 hover:decoration-accent">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} onQuickView={setQv} eager={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* What the shop promises, in its own words. */}
      <section className="section">
        <div className="container">
          <p className="max-w-[24ch] font-display text-section leading-[1.05]">
            Specs you can compare, prices without games, and a preview before every click.
          </p>
          <div className="mt-10 grid gap-8 border-t-2 border-ink pt-6 md:grid-cols-[1fr_2fr]">
            <p className="text-muted">Built for people who research before they buy.</p>
            <dl className="grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="font-medium">Shipping</dt>
                <dd className="mt-1 text-sm text-muted">Free over P1,500, out in one to two days.</dd>
              </div>
              <div>
                <dt className="font-medium">Warranty</dt>
                <dd className="mt-1 text-sm text-muted">Two years on every gadget in the catalog.</dd>
              </div>
              <div>
                <dt className="font-medium">Returns</dt>
                <dd className="mt-1 text-sm text-muted">Seven days, unopened or not working.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Best sellers as ruled rows. */}
      <section className="section--tight">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-section">Best sellers</h2>
            <Link to="/shop?sort=rating" className="text-sm font-medium underline decoration-ink underline-offset-4 hover:decoration-accent">
              Sort by rating
            </Link>
          </div>
          <ul className="mt-6 border-t-2 border-ink">
            {best.map((p) => (
              <li key={p.id} className="border-b border-rule">
                <Link to={`/product/${p.slug}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 py-4 hover:bg-accent-soft">
                  <img
                    src={p.images?.[0]}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    className="h-16 w-16 border border-ink object-cover"
                  />
                  <span>
                    <span className="block font-display text-lg leading-tight">{p.name}</span>
                    <span className="mt-1 block text-sm text-muted">{p.brand}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="code">{formatPeso(priceOf(p))}</span>
                    <Stars value={p.rating} count={p.rating_count} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}
