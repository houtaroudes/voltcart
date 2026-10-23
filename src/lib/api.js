import { supabase } from './supabase.js'
import { localListProducts, localProducts, localGetDeals as localDeals, categories } from './local-store.js'

/**
 * One data module for the whole app. Everything the UI needs to read goes
 * through these functions. Supabase is optional: when it is not configured,
 * or when a request errors or never answers, the local demo catalog is used so
 * no route is left on a skeleton.
 */

const REMOTE_WAIT_MS = 2500
let warned = false
let remoteDown = false

/*
 * Only a transport failure means the backend is down. A PostgREST error means
 * it answered, and latching the whole session onto the demo catalog for one bad
 * query hid working data.
 */
function isOutage(err) {
  if (!err) return true
  if (err.message === 'no answer in time') return true
  if (typeof err.status === 'number') return err.status >= 500
  return !err.code
}

/*
 * Race the remote read against a short deadline. A project that is configured
 * but unreachable used to leave every page loading forever; now it degrades to
 * the demo catalog and the storefront keeps working.
 */
async function remote(query, fallback) {
  if (!supabase || remoteDown) return fallback()
  let timer
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('no answer in time')), REMOTE_WAIT_MS)
  })
  try {
    const { data, error } = await Promise.race([query(), deadline])
    if (error) throw error
    return data ?? []
  } catch (err) {
    // A missing row is not an outage, and neither is a query the database rejected.
    if (err?.message === 'Product not found') return fallback()
    if (isOutage(err)) {
      remoteDown = true
      if (!warned) {
        warned = true
        console.warn(`Voltcart: showing the demo catalog because Supabase did not answer (${err?.message ?? err}).`)
      }
    }
    return fallback()
  } finally {
    clearTimeout(timer)
  }
}

export async function listProducts({ category, order = 'featured', search = '' } = {}) {
  return remote(
    () => {
      let q = supabase.from('voltcart_products').select('*')
      if (category) q = q.eq('category', category)
      if (search) q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%`)
      const map = { 'price-asc': { col: 'sale_price', asc: true }, 'price-desc': { col: 'sale_price', asc: false }, rating: { col: 'rating', asc: false }, featured: { col: 'viewing', asc: false } }
      const m = map[order] ?? map.featured
      return q.order(m.col, { ascending: m.asc, nullsFirst: false })
    },
    () => localListProducts({ category, order, search }),
  )
}

export async function listBestSellers(limit = 4) {
  return remote(
    () => supabase.from('voltcart_products').select('*').order('rating_count', { ascending: false }).limit(limit),
    () => [...localProducts].sort((a, b) => b.rating_count - a.rating_count).slice(0, limit),
  )
}

export async function listFeatured(limit = 8) {
  return remote(
    () => supabase.from('voltcart_products').select('*').order('viewing', { ascending: false }).limit(limit),
    () => [...localProducts].sort((a, b) => b.viewing - a.viewing).slice(0, limit),
  )
}

const findLocal = (ref) => {
  const p = localProducts.find((r) => r.id === ref || r.slug === ref)
  if (!p) throw new Error('Product not found')
  return p
}

export async function getProduct(slug) {
  return remote(async () => {
    const { data, error } = await supabase.from('voltcart_products').select('*').eq('slug', slug).maybeSingle()
    if (error) throw error
    if (!data) throw new Error('Product not found')
    return { data }
  }, () => findLocal(slug))
}

/*
 * Compare pins ids, not slugs, so the drawer needs a lookup that accepts
 * either. Without it the drawer stayed empty on every pin.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getProductByRef(ref) {
  return remote(async () => {
    /* `id` is a uuid column: comparing it to a slug made Postgres reject the request. */
    const match = UUID.test(ref)
      ? supabase.from('voltcart_products').select('*').or(`id.eq.${ref},slug.eq.${ref}`)
      : supabase.from('voltcart_products').select('*').eq('slug', ref)
    const { data, error } = await match.maybeSingle()
    if (error) throw error
    if (!data) throw new Error('Product not found')
    return { data }
  }, () => findLocal(ref))
}

export async function listRelated(category, slug, limit = 4) {
  return remote(
    () => supabase.from('voltcart_products').select('*').eq('category', category).neq('slug', slug).limit(limit),
    () => localProducts.filter((p) => p.category === category && p.slug !== slug).slice(0, limit),
  )
}

export async function listCategories() {
  return remote(
    () => supabase.from('voltcart_categories').select('*').order('sort'),
    () => categories,
  )
}

export async function listDeals() {
  return remote(
    () => supabase.from('voltcart_deals').select('*').order('sort'),
    () => localDeals(),
  )
}

export function priceOf(p) {
  return p?.sale_price ?? p?.price
}

export function formatPeso(n) {
  return n.toLocaleString('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })
}
