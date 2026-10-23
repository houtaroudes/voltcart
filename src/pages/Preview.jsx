import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getProduct, getProductByRef, listRelated } from '../lib/api.js'
import { previewUrl, copyText } from '../lib/share.js'
import { useCompare, useToast } from '../hooks/use-session-stores.jsx'
import QuickView from '../components/QuickView.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFound from './NotFound.jsx'

/**
 * A shared link, not a page to land on cold. The product opens in its preview
 * plate over its category, and up to two alternatives arrive pinned in the
 * compare drawer from the query string.
 *
 * The link and the drawer stay in step both ways: what the link names is
 * pinned on arrival, and what the visitor pins afterwards is written back into
 * the address bar so the URL they copy is the comparison they are looking at.
 */
export default function Preview() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const compare = useCompare()
  const toast = useToast()
  const [product, setProduct] = useState(null)
  const [shown, setShown] = useState(null)
  const [plate, setPlate] = useState(true)
  const [related, setRelated] = useState([])
  const [miss, setMiss] = useState(false)
  const [copied, setCopied] = useState(null) // null | 'ok' | 'fail'
  const [pins, setPins] = useState([]) // slugs travelling in `compare`
  const applied = useRef(null) // slug whose link has already been pinned
  const written = useRef(null) // last query string this page wrote out

  const compareParam = params.get('compare') ?? ''

  useEffect(() => {
    let dead = false
    setProduct(null)
    setShown(null)
    setPlate(true)
    setMiss(false)
    applied.current = null
    written.current = null
    setPins([])
    setCopied(null)
    getProduct(slug)
      .then((p) => {
        if (dead) return
        setProduct(p)
        listRelated(p.category, slug, 4)
          .then((rows) => !dead && setRelated(rows))
          .catch(() => {})
      })
      .catch(() => !dead && setMiss(true))
    return () => {
      dead = true
    }
  }, [slug])

  /*
   * Arrival: the product the link names is always pinned, plus up to two
   * alternatives. A slug that left the catalog is dropped and named once,
   * rather than failing the whole link. This runs once per slug, so the writes
   * below cannot feed back into it and re-add a pin the visitor removed.
   */
  useEffect(() => {
    if (!product || applied.current === slug) return
    const extras = [...new Set(compareParam.split(',').map((s) => s.trim()).filter((s) => s && s !== slug))].slice(0, 2)
    if (extras.length === 0) {
      applied.current = slug
      compare.set([product.id])
      return
    }
    let dead = false
    Promise.all(extras.map((ref) => getProductByRef(ref).catch(() => null))).then((rows) => {
      if (dead) return
      const found = rows.filter(Boolean)
      if (found.length < extras.length) toast.push('One product in this link is no longer in the catalog.', 'error')
      applied.current = slug
      compare.set([product.id, ...found.map((p) => p.id)])
    })
    return () => {
      dead = true
    }
  }, [product, compareParam, slug, compare, toast])

  /* Departure: whatever is pinned now becomes the query string, minus the product the path already names. */
  useEffect(() => {
    if (!product || applied.current !== slug) return
    let dead = false
    Promise.all(compare.ids.map((id) => getProductByRef(id).catch(() => null))).then((rows) => {
      if (dead) return
      const next = rows
        .filter(Boolean)
        .map((p) => p.slug)
        .filter((s) => s !== slug)
        .slice(0, 2)
      setPins(next)
      const search = next.length ? `?compare=${next.map(encodeURIComponent).join(',')}` : ''
      if (written.current === search) return
      written.current = search
      navigate(`/preview/${slug}${search}`, { replace: true })
    })
    return () => {
      dead = true
    }
  }, [compare.ids, product, slug, navigate])

  const shareUrl = previewUrl(slug, pins)

  const copyLink = async () => {
    const ok = await copyText(shareUrl)
    setCopied(ok ? 'ok' : 'fail')
    window.setTimeout(() => setCopied(null), 2400)
  }

  if (miss) return <NotFound />

  if (!product) {
    return (
      <div className="container py-10">
        <div className="h-4 w-28 animate-pulse bg-paper-2" />
        <div className="mt-4 h-12 w-2/3 animate-pulse bg-paper-2" />
        <div className="mt-3 h-4 w-40 animate-pulse bg-paper-2" />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-80 animate-pulse border-2 border-ink bg-paper-2" />
          ))}
        </div>
      </div>
    )
  }

  const active = shown ?? product
  const onPrimary = active.id === product.id

  return (
    <div className="container py-10">
      <p className="code text-xs uppercase tracking-[0.08em] text-muted">Shared preview</p>
      <h1 className="mt-2 font-display text-section">{product.name}</h1>
      <p className="mt-2 text-muted">
        {product.brand} · Open the plate to see the specs, or pin it against something else.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-y-2 border-ink py-3">
        <p className="code min-w-0 flex-1 select-all break-all text-sm text-muted">{shareUrl}</p>
        <button type="button" onClick={copyLink} aria-live="polite" className={`btn ${copied === 'fail' ? 'btn--second text-accent' : 'btn--second'}`}>
          {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed, select the link' : 'Copy link'}
        </button>
        {!plate && (
          <button type="button" onClick={() => setPlate(true)} className="btn btn--primary">
            Open the plate
          </button>
        )}
      </div>

      {related.length > 0 && (
        <section className="section--tight">
          <h2 className="border-b-2 border-ink pb-4 font-display text-section capitalize">More in {product.category.replace('-', ' ')}</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setShown} />
            ))}
          </div>
        </section>
      )}

      {plate && (
        <QuickView
          key={active.id}
          product={active}
          shareUrl={onPrimary ? shareUrl : undefined}
          onClose={() => {
            setShown(null)
            setPlate(false)
          }}
        />
      )}
    </div>
  )
}
