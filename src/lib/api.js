import { supabase } from './supabase.js'
import { localListProducts, localProducts, localGetDeals as localDeals } from './local-store.js'

/**
 * One data module for the whole app. Everything the UI needs to read goes
 * through these functions, and each one falls back to the local demo store
 * when the Supabase client is absent (no env vars configured).
 */

export async function listProducts({ category, order = 'featured', search = '' } = {}) {
  if (!supabase) return localListProducts({ category, order, search })
  let q = supabase.from('voltcart_products').select('*')
  if (category) q = q.eq('category', category)
  if (search) q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%`)
  const map = { 'price-asc': { col: 'sale_price', asc: true }, 'price-desc': { col: 'sale_price', asc: false }, rating: { col: 'rating', asc: false }, featured: { col: 'viewing', asc: false } }
  const m = map[order] ?? map.featured
  q = q.order(m.col, { ascending: m.asc, nullsFirst: false })
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function listBestSellers(limit = 4) {
  if (!supabase) return [...localProducts].sort((a, b) => b.rating_count - a.rating_count).slice(0, limit)
  const { data, error } = await supabase
    .from('voltcart_products')
    .select('*')
    .order('rating_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function listFeatured(limit = 8) {
  if (!supabase) return [...localProducts].sort((a, b) => b.viewing - a.viewing).slice(0, limit)
  const { data, error } = await supabase
    .from('voltcart_products')
    .select('*')
    .order('viewing', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getProduct(slug) {
  if (!supabase) {
    const p = localProducts.find((r) => r.slug === slug)
    if (!p) throw new Error('Product not found')
    return p
  }
  const { data, error } = await supabase.from('voltcart_products').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  if (!data) throw new Error('Product not found')
  return data
}

export async function listRelated(category, slug, limit = 4) {
  if (!supabase) return localProducts.filter((p) => p.category === category && p.slug !== slug).slice(0, limit)
  const { data, error } = await supabase
    .from('voltcart_products')
    .select('*')
    .eq('category', category)
    .neq('slug', slug)
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function listCategories() {
  if (!supabase) return (await import('./local-store.js')).categories
  const { data, error } = await supabase.from('voltcart_categories').select('*').order('sort')
  if (error) throw error
  return data ?? []
}

export async function listDeals() {
  if (!supabase) return localDeals()
  const { data, error } = await supabase.from('voltcart_deals').select('*').order('sort')
  if (error) throw error
  return data ?? []
}

export function priceOf(p) {
  return p?.sale_price ?? p?.price
}

export function formatPeso(n) {
  return n.toLocaleString('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })
}
