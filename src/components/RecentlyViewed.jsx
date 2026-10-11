import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRecent } from '../hooks/use-session-stores.jsx'
import { listProducts, priceOf, formatPeso } from '../lib/api.js'

export default function RecentlyViewed() {
  const recent = useRecent()
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (recent.slugs.length === 0) {
      setRows([])
      return
    }
    listProducts().then((all) => {
      setRows(recent.slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean))
    }).catch(() => {})
  }, [recent.slugs])

  if (rows.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-2" aria-label="Recently viewed">
      <h2 className="text-lg font-bold">Recently viewed</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {rows.map((p) => (
          <Link
            key={p.slug}
            to={`/product/${p.slug}`}
            className="flex w-40 shrink-0 flex-col rounded-xl bg-card p-3 ring-1 ring-line hover:ring-volt"
          >
            <img src={p.images?.[0]} alt="" className="aspect-square w-full rounded-lg object-cover" loading="lazy" />
            <p className="mt-2 truncate text-xs font-medium">{p.name}</p>
            <p className="text-sm font-semibold">{formatPeso(priceOf(p))}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
