import { useEffect, useState } from 'react'
import { getProduct, priceOf, formatPeso } from '../lib/api.js'
import { useCompare } from '../hooks/use-session-stores.jsx'
import { X, Scale } from './Icons.jsx'
import Stars from './Stars.jsx'

export default function CompareDrawer() {
  const { ids, has, toggle, clear } = useCompare()
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let dead = false
    Promise.all(ids.map((id) => findProduct(id)))
      .then((rows) => !dead && setProducts(rows.filter(Boolean)))
      .catch(() => {})
    return () => {
      dead = true
    }
  }, [ids])

  if (ids.length === 0) return null
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-xl"
      >
        <Scale /> Compare ({ids.length})
      </button>
    )
  }

  // Union of spec keys across pinned products keeps the table honest.
  const keys = [...new Set(products.flatMap((p) => Object.keys(p.specs ?? {})))]
  const short = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, ' ') : '')

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(94vw,56rem)] -translate-x-1/2 rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-line">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold"><Scale /> Compare ({products.length}/3)</p>
        <div className="flex gap-2">
          <button type="button" onClick={clear} className="text-xs text-mute hover:text-rose-500">Clear all</button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Minimise compare drawer" className="text-mute hover:text-ink">
            <X />
          </button>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Side by side product comparison</caption>
            <thead>
              <tr>
                <th scope="col" className="w-24" />
                {products.map((p) => (
                  <th key={p.id} scope="col" className="p-2 text-left align-bottom">
                    <img src={p.images?.[0]} alt="" className="mb-1 h-14 w-full max-w-24 rounded-lg object-cover" />
                    <span className="font-medium">{p.name}</span>
                    <button type="button" onClick={() => toggle(p.id)} aria-label={`Remove ${p.name} from compare`} className="ml-1 align-middle text-mute hover:text-rose-500">
                      <X />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="py-1.5 text-left text-mute">Price</th>
                {products.map((p) => (
                  <td key={p.id} className="px-2 py-1.5 font-semibold">{formatPeso(priceOf(p))}</td>
                ))}
              </tr>
              <tr className="border-t border-line">
                <th scope="row" className="py-1.5 text-left text-mute">Rating</th>
                {products.map((p) => (
                  <td key={p.id} className="px-2 py-1.5"><Stars value={p.rating} /></td>
                ))}
              </tr>
              {keys.map((k) => (
                <tr key={k} className="border-t border-line">
                  <th scope="row" className="py-1.5 text-left text-mute">{short(k)}</th>
                  {products.map((p) => (
                    <td key={p.id} className="px-2 py-1.5">{String(p.specs?.[k] ?? '-')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

async function findProduct(id) {
  // Compare works from whatever id set is pinned; slug lookup is by id OR slug.
  const mod = await import('../lib/api.js')
  const { getProductByRef } = mod
  try {
    return await getProductByRef(id)
  } catch {
    return null
  }
}
