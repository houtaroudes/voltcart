import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts, listDeals, listCategories, listBestSellers, listFeatured, priceOf, formatPeso } from '../lib/api.js'
import DealZone from '../components/DealZone.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import Stars from '../components/Stars.jsx'
import { Truck, Shield, Refresh, Eye, Chevron } from '../components/Icons.jsx'

export default function Home() {
  const [deals, setDeals] = useState([])
  const [cats, setCats] = useState([])
  const [featured, setFeatured] = useState([])
  const [best, setBest] = useState([])
  const [qv, setQv] = useState(null)

  useEffect(() => {
    listDeals().then(setDeals).catch(() => {})
    listCategories().then(setCats).catch(() => {})
    listFeatured(8).then(setFeatured).catch(() => {})
    listBestSellers(4).then(setBest).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-volt-deep via-volt to-surge text-white">
        <div className="grid items-center gap-6 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">Gadget Season 2026</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Gear that keeps <span className="text-amber-300">up with you</span>
            </h1>
            <p className="mt-4 max-w-md text-white/85">
              Phones, audio, wearables and smart home picks, pitched at real prices. Every card previews in place, and the deal zone always shows what drops next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="rounded-xl bg-white px-5 py-3 font-semibold text-volt-deep hover:bg-white/90">Shop the collection</Link>
              <Link to="/shop?category=audio" className="rounded-xl px-5 py-3 font-semibold ring-1 ring-white/50 hover:bg-white/10">Audio deals</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
              <span className="flex items-center gap-2"><Truck /> Free shipping over P1,500</span>
              <span className="flex items-center gap-2"><Shield /> 2 year warranty</span>
              <span className="flex items-center gap-2"><Refresh /> 7 day returns</span>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&q=80&auto=format&fit=crop"
              alt="Laptop and gadgets on a desk"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white/95 p-4 text-ink shadow-xl">
              <p className="text-xs text-mute">Live in the store</p>
              <p className="text-xl font-bold">412 gadgets</p>
              <p className="flex items-center gap-1 text-xs text-rose-500"><Eye /> 97 people shopping now</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Zone */}
      <div className="mt-6">
        <DealZone deals={deals} />
      </div>

      {/* Categories */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <p className="text-mute">Find your next upgrade in a few clicks.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-card p-5 text-center ring-1 ring-line hover:ring-volt"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-volt/10 text-volt group-hover:bg-volt group-hover:text-white">
                <CategoryIcon slug={c.slug} />
              </span>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Hot right now</h2>
            <p className="text-mute">What everyone is eyeing this week.</p>
          </div>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-medium text-volt hover:underline">
            View all <Chevron />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQv} />
          ))}
        </div>
      </section>

      {/* Best sellers sidebar-style strip */}
      <section className="mt-12 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-card p-8 ring-1 ring-line">
          <h2 className="text-2xl font-bold">Voltcart promise</h2>
          <p className="mt-2 max-w-md text-mute">
            Specs you can compare, prices without games, and a preview before every click. Built for people who research before they buy.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[['120+', 'Gadgets curated'], ['4.8', 'Average rating'], ['32k', 'Orders shipped'], ['24/7', 'Support chat']].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-paper p-4 text-center">
                <p className="text-xl font-bold text-volt-deep">{n}</p>
                <p className="text-xs text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Best sellers</h3>
            <Link to="/shop?sort=rating" className="text-xs text-volt hover:underline">View all</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {best.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <img src={p.images?.[0]} alt="" className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${p.slug}`} className="truncate text-sm font-medium hover:text-volt">{p.name}</Link>
                  <Stars value={p.rating} />
                  <p className="text-sm font-semibold">{formatPeso(priceOf(p))}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}

function CategoryIcon({ slug }) {
  const paths = {
    phones: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 18h2',
    audio: 'M4 14v-2a8 8 0 0 1 16 0v2m-16 0a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z',
    wearables: 'M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm-3.5-2L9 1h6l.5 3m-11 16 .5 3h6l.5-3',
    laptops: 'M4 5h16v11H4zM2 19h20',
    accessories: 'M8 3v6m8 6v6M8 9h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Z',
    'smart-home': 'M3 11 12 3l9 8M6 10v10h12V10',
  }
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[slug] ?? paths.accessories} />
    </svg>
  )
}
