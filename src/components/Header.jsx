import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart, useWishlist, useToast } from '../hooks/use-session-stores.jsx'
import { listProducts } from '../lib/api.js'
import { Search, User, Heart, Cart, Bolt, Menu, X } from './Icons.jsx'
import { useEffect, useState } from 'react'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=audio', label: 'Audio' },
  { to: '/shop?category=wearables', label: 'Wearables' },
  { to: '/shop?category=smart-home', label: 'Smart Home' },
  { to: '/about', label: 'About' },
]

const linkBase = 'whitespace-nowrap border-b-2 border-transparent px-2 py-2 text-sm font-medium text-paper hover:border-paper'
const linkActive = 'whitespace-nowrap border-b-2 border-paper px-2 py-2 text-sm font-medium text-paper'

export default function Header() {
  const cart = useCart()
  const wish = useWishlist()
  const toast = useToast()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [catalog, setCatalog] = useState(null)

  /*
   * The saved lists hold ids, and a product can leave the catalog. Resolve the
   * badges against the current catalog so the header never claims an item the
   * cart page cannot show.
   */
  useEffect(() => {
    let alive = true
    listProducts()
      .then((rows) => alive && setCatalog(rows))
      .catch(() => alive && setCatalog([]))
    return () => {
      alive = false
    }
  }, [])

  const live = catalog ? new Set(catalog.map((p) => p.id)) : null
  const cartCount = live ? cart.items.filter((it) => live.has(it.id)).reduce((n, it) => n + it.qty, 0) : cart.count
  const wishCount = live ? wish.ids.filter((id) => live.has(id)).length : wish.ids.length

  const isNavActive = (to) => {
    const [path, query = ''] = to.split('?')
    if (pathname !== path) return false
    if (query) {
      const want = new URLSearchParams(query)
      const have = new URLSearchParams(search)
      return [...want].every(([k, v]) => have.get(k) === v)
    }
    if (path === '/shop') return !new URLSearchParams(search).has('category')
    return path === '/'
  }

  const submit = (e) => {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-[300] bg-ink text-paper">
      <div className="container flex h-[72px] items-center gap-6">
        <Link to="/" aria-label="Voltcart home" className="flex shrink-0 items-center gap-2">
          <Bolt className="text-accent" />
          <span className="font-display text-[22px] font-bold leading-none tracking-tight">Voltcart</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className={isNavActive(n.to) ? linkActive : linkBase}>
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden w-56 md:block" role="search">
          <label className="flex h-11 items-center gap-2 border border-paper/40 bg-ink px-3 text-paper">
            <Search className="text-paper/70" />
            <span className="visually-hidden">Search products</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search gadgets"
              aria-label="Search products"
              className="w-full bg-transparent text-sm text-paper placeholder:text-paper/60 focus:outline-none"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            type="button"
            onClick={() => toast.push('Accounts are coming soon. Your cart and wishlist stay saved in this browser.')}
            className="rounded-none p-2 text-paper/80 hover:text-paper"
            aria-label="Account (coming soon)"
          >
            <User />
          </button>
          <Link to="/wishlist" className="flex items-center gap-1.5 p-2 text-paper/80 hover:text-paper" aria-label={`Wishlist, ${wishCount} saved`}>
            <Heart />
            <span className="code text-xs">{wishCount}</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-1.5 p-2 text-paper/80 hover:text-paper"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <Cart />
            <span className="code text-xs">{cartCount}</span>
          </Link>
          <button
            type="button"
            className="p-2 text-paper lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-paper/30 px-0 pb-4 lg:hidden">
          <div className="container">
            <form onSubmit={submit} className="mt-4 md:hidden" role="search">
              <label className="flex h-11 items-center gap-2 border border-paper/40 px-3 text-paper">
                <Search className="text-paper/70" />
                <span className="visually-hidden">Search products</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search gadgets"
                  aria-label="Search products"
                  className="w-full bg-transparent text-sm text-paper placeholder:text-paper/60 focus:outline-none"
                />
              </label>
            </form>
            <nav aria-label="Main, small screens" className="mt-4 grid gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`whitespace-nowrap px-2 py-2.5 text-sm font-medium ${
                    isNavActive(n.to) ? 'border-l-2 border-paper pl-3 text-paper' : 'text-paper/80'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
