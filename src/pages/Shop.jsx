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
    <div className="container py-10">
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="h-fit lg:sticky lg:top-[88px]" aria-label="Filters">
          <p className="border-b-2 border-ink pb-3 font-display text-lg">Filters</p>

          <div className="mt-5">
            <p className="text-sm text-muted">Category</p>
            <div className="mt-2 grid">
              <button
                type="button"
                onClick={() => patch('category', '')}
                aria-pressed={!category}
                className={`min-h-11 border-b border-rule px-2 py-2 text-left text-sm hover:bg-paper-2 ${
                  !category ? 'bg-accent-soft font-medium text-ink' : ''
                }`}
              >
                All
              </button>
              {cats.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => patch('category', c.slug)}
                  aria-pressed={category === c.slug}
                  className={`min-h-11 border-b border-rule px-2 py-2 text-left text-sm hover:bg-paper-2 ${
                    category === c.slug ? 'bg-accent-soft font-medium text-ink' : ''
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="sort" className="text-sm text-muted">
              Sort
            </label>
            <select id="sort" value={sort} onChange={(e) => patch('sort', e.target.value)} className="field mt-2">
              <option value="featured">Most viewed</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-4">
            <h1 className="font-display text-section">{title}</h1>
            <p className="code text-sm text-muted">{loading ? 'Loading' : `${items.length} products`}</p>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-80 animate-pulse border-2 border-ink bg-paper-2" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mt-8 border-2 border-ink bg-plate p-10">
              <p className="font-display text-lg">Nothing matches that yet.</p>
              <p className="mt-2 text-muted">Try a different category or clear the search.</p>
              <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="btn btn--primary mt-6">
                Clear the filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} onQuickView={setQv} eager={i === 0} />
              ))}
            </div>
          )}
        </div>
      </div>
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}
