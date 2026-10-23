import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function useCountdown(target) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(target) - Date.now()))
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(target) - Date.now())), 1000)
    return () => clearInterval(t)
  }, [target])
  const s = Math.floor(left / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

export default function DealZone({ deals = [] }) {
  const [i, setI] = useState(0)

  /* Hooks must run unconditionally: the deals array arrives async, so the
   * early return below cannot sit above useCountdown. */
  const target = deals[i]?.ends_at ?? Date.now() + 864e5
  const c = useCountdown(target)

  if (!deals.length) return null
  const deal = deals[i] ?? deals[0] ?? null
  if (!deal) return null

  return (
    <section aria-label="Deal zone" className="section--band">
      <div className="container grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="flex items-center gap-5">
          {deal.image_url && (
            <img
              src={deal.image_url}
              alt=""
              width="240"
              height="180"
              loading="lazy"
              className="hidden aspect-[4/3] w-32 border-2 border-ink object-cover sm:block"
            />
          )}
          <div>
            <p className="code text-sm text-accent">{deal.discount_text}</p>
            <h2 className="mt-1 font-display text-title leading-tight">{deal.title}</h2>
            <p className="mt-2 max-w-[46ch] text-sm text-muted">{deal.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 lg:justify-end">
          <div className="flex gap-1.5" aria-label="Deal ends in">
            {[[c.d, 'days'], [c.h, 'hrs'], [c.m, 'min'], [c.s, 'sec']].map(([v, l]) => (
              <div key={l} className="w-14 bg-ink px-1 py-2 text-center text-paper">
                <div className="code text-base leading-5">{pad(v)}</div>
                <div className="text-[11px] text-paper/70">{l}</div>
              </div>
            ))}
          </div>
          <Link to={deal.category ? `/shop?category=${deal.category}` : '/shop'} className="btn btn--primary">
            {deal.cta_label}
          </Link>
        </div>
      </div>

      {deals.length > 1 && (
        <div className="container mt-6 flex gap-1.5">
          {deals.map((d, k) => (
            <button
              key={d.id ?? k}
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show deal ${k + 1}: ${d.title}`}
              aria-pressed={k === i}
              className={`h-2 w-8 border border-ink ${k === i ? 'bg-ink' : 'bg-transparent hover:bg-paper-3'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
