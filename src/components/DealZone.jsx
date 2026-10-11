import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bolt } from './Icons.jsx'

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
  useEffect(() => {
    if (deals.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % deals.length), 6000)
    return () => clearInterval(t)
  }, [deals.length])

  /* Hooks must run unconditionally: the deals array arrives async, so the
   * early return below cannot sit above useCountdown. */
  const target = deals[i]?.ends_at ?? Date.now() + 864e5
  const c = useCountdown(target)

  if (!deals.length) return null
  const deal = deals[i] ?? deals[0] ?? null
  if (!deal) return null
  const accent = deal.accent === 'cyan' ? 'from-surge to-volt' : 'from-volt to-surge'

  return (
    <section aria-label="Deal zone" className="relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line">
      <div className={`bg-gradient-to-r ${accent} px-5 py-1.5 text-sm font-semibold text-white`}>
        <span className="inline-flex items-center gap-1.5"><Bolt /> Deal Zone</span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-4">
          {deal.image_url && <img src={deal.image_url} alt="" className="h-20 w-24 rounded-xl object-cover" loading="lazy" />}
          <div>
            <p className="text-xl font-bold">{deal.discount_text} {deal.title}</p>
            <p className="text-sm text-mute">{deal.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 text-center" aria-label="Deal ends in">
            {[[c.d, 'days'], [c.h, 'hrs'], [c.m, 'min'], [c.s, 'sec']].map(([v, l]) => (
              <div key={l} className="w-11 rounded-lg bg-ink px-1 py-1.5 text-white">
                <div className="text-sm font-bold leading-5">{pad(v)}</div>
                <div className="text-[10px] opacity-70">{l}</div>
              </div>
            ))}
          </div>
          <Link
            to={`/shop?deal=1`}
            className="rounded-xl bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-deep"
          >
            {deal.cta_label}
          </Link>
        </div>
      </div>
      {deals.length > 1 && (
        <div className="absolute bottom-2 right-4 flex gap-1">
          {deals.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`Deal ${k + 1}`} className={`h-1.5 w-4 rounded-full ${k === i ? 'bg-volt' : 'bg-line'}`} />
          ))}
        </div>
      )}
    </section>
  )
}
