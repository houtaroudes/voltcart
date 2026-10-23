import { useEffect, useState } from 'react'
import { priceOf, formatPeso, getProductByRef } from '../lib/api.js'
import { useCompare, useToast } from '../hooks/use-session-stores.jsx'
import { previewUrl, copyText } from '../lib/share.js'
import { X, Scale } from './Icons.jsx'
import Stars from './Stars.jsx'

export default function CompareDrawer() {
  const { ids, toggle, clear } = useCompare()
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    let dead = false
    Promise.all(ids.map((id) => getProductByRef(id).catch(() => null)))
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
        className="fixed bottom-4 left-4 z-[200] flex items-center gap-2 border-2 border-paper bg-ink px-4 py-2.5 text-sm font-medium text-paper"
      >
        <Scale /> Compare ({ids.length})
      </button>
    )
  }

  // Union of spec keys across pinned products keeps the table honest.
  const keys = [...new Set(products.flatMap((p) => Object.keys(p.specs ?? {})))]
  const short = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, ' ') : '')

  const shareComparison = async () => {
    if (products.length === 0) return
    const url = previewUrl(products[0].slug, products.slice(1).map((p) => p.slug))
    const ok = await copyText(url)
    toast.push(ok ? 'Comparison link copied.' : `Copy failed. The link is ${url}`, ok ? 'cyan' : 'error')
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[200] w-[min(94vw,56rem)] -translate-x-1/2">
      <div className="plate p-4">
        <div className="flex items-center justify-between border-b border-rule pb-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Scale /> Compare ({products.length}/3)
          </p>
          <div className="flex items-center gap-4">
            {products.length > 0 && (
              <button type="button" onClick={shareComparison} className="text-sm text-muted hover:text-accent">
                Copy link
              </button>
            )}
            <button type="button" onClick={clear} className="text-sm text-muted hover:text-accent">
              Clear all
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Minimise compare drawer" className="text-ink hover:text-accent">
              <X />
            </button>
          </div>
        </div>

        {products.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="spec">
              <caption className="visually-hidden">Side by side product comparison</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-24" />
                  {products.map((p) => (
                    <th key={p.id} scope="col" className="align-bottom">
                      <span className="flex items-center gap-2">
                        <img src={p.images?.[0]} alt="" width="56" height="56" className="h-14 w-14 border border-ink object-cover" />
                        <span className="text-ink">{p.name}</span>
                        <button
                          type="button"
                          onClick={() => toggle(p.id)}
                          aria-label={`Remove ${p.name} from compare`}
                          className="text-muted hover:text-accent"
                        >
                          <X />
                        </button>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="text-sm font-normal text-muted">Price</th>
                  {products.map((p) => (
                    <td key={p.id}>
                      <span className="code">{formatPeso(priceOf(p))}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="text-sm font-normal text-muted">Rating</th>
                  {products.map((p) => (
                    <td key={p.id}><Stars value={p.rating} /></td>
                  ))}
                </tr>
                {keys.map((k) => (
                  <tr key={k}>
                    <th scope="row" className="text-sm font-normal text-muted">{short(k)}</th>
                    {products.map((p) => (
                      <td key={p.id}>{String(p.specs?.[k] ?? '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

