import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listProducts, listCategories } from '../lib/api.js'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [cats, setCats] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [qv, setQv] = useState(null)

  const category = params.get('category') ?? ''
  const search = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'featured'

  useEffect(() => {
    listCategories().then(setCats).catch(() => {})
  }, [])

  useEffect(() => {
    let dead = false
    setLoading(true)
    listProducts({ category, search: search || '', order: sort })
      .then((rows) => {
        if (!dead) {
          setItems(rows)
          setLoading(false)
        }
      })
      .catch(() => !dead && setLoading(false))
    return () => {
      dead = true
    }
  }, [category, search, sort])

  const patch = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const title = useMemo(() => {
    if (search) return `Results for "${search}"`
    if (category) return cats.find((c) => c.slug === category)?.name ?? category
    return 'All gadgets'
  }, [category, search, cats])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="h-fit rounded-2xl bg-card p-4 ring-1 ring-line lg:sticky lg:top-20">
          <h2 className="font-bold">Filters</h2>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-mute">Category</p>
            <div className="mt-2 grid">
              <button
                type="button"
                onClick={() => patch('category', '')}
                className={`rounded-lg px-2 py-1.5 text-left text-sm hover:bg-paper ${!category ? 'bg-volt/10 font-semibold text-volt-deep' : ''}`}
              >
                All
              </button>
              {cats.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => patch('category', c.slug)}
                  className={`rounded-lg px-2 py-1.5 text-left text-sm hover:bg-paper ${category === c.slug ? 'bg-volt/10 font-semibold text-volt-deep' : ''}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-mute">Sort</p>
            <select
              value={sort}
              onChange={(e) => patch('sort', e.target.value)}
              className="mt-2 w-full rounded-lg bg-paper px-2 py-2 text-sm ring-1 ring-line"
              aria-label="Sort products"
            >
              <option value="featured">Most viewed</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-baseline justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-mute">{loading ? 'Loading...' : `${items.length} products`}</p>
          </div>
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-card ring-1 ring-line" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mt-10 rounded-2xl bg-card p-10 text-center ring-1 ring-line">
              <p className="font-semibold">Nothing matches that yet.</p>
              <p className="text-sm text-mute">Try a different category or clear the search.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQv} />
              ))}
            </div>
          )}
        </div>
      </div>
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}
