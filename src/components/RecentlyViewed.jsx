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
    <section className="container mt-16" aria-label="Recently viewed">
      <p className="border-b-2 border-ink pb-2 font-display text-title">Recently viewed</p>
      <div className="rail mt-6">
        {rows.map((p) => (
          <Link key={p.slug} to={`/product/${p.slug}`} className="plate plate-link w-48 p-3">
            <img src={p.images?.[0]} alt="" width="160" height="160" loading="lazy" className="aspect-square w-full border border-ink object-cover" />
            <p className="mt-2 truncate text-sm font-medium">{p.name}</p>
            <p className="code text-sm text-muted">{formatPeso(priceOf(p))}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
