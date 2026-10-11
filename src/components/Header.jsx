import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart, useWishlist } from '../hooks/use-session-stores.jsx'
import { Search, User, Heart, Cart, Bolt } from './Icons.jsx'
import { useState } from 'react'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=audio', label: 'Audio' },
  { to: '/shop?category=wearables', label: 'Wearables' },
  { to: '/shop?category=smart-home', label: 'Smart Home' },
  { to: '/about', label: 'About' },
]

export default function Header() {
  const cart = useCart()
  const wish = useWishlist()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  const badge = (n, tone) => (
    <span className={`absolute -right-1.5 -top-1.5 h-4 min-w-4 rounded-full px-1 text-[10px] font-bold leading-4 text-white ${tone}`}>
      {n > 99 ? '99+' : n}
    </span>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-volt text-white">
            <Bolt />
          </span>
          Voltcart
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper ${isActive ? 'text-volt' : 'text-ink'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden w-56 md:block">
          <label className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 ring-1 ring-line">
            <Search className="text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search gadgets..."
              aria-label="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button type="button" className="rounded-full p-2 text-mute hover:text-ink" aria-label="Account (coming soon)">
            <User />
          </button>
          <Link to="/wishlist" className="relative rounded-full p-2 text-mute hover:text-ink" aria-label="Wishlist">
            <Heart />
            {wish.ids.length > 0 && badge(wish.ids.length, 'bg-rose-500')}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 text-mute hover:text-ink" aria-label="Cart">
            <Cart />
            {cart.count > 0 && badge(cart.count, 'bg-volt')}
          </Link>
          <button type="button" className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-card px-4 py-3 lg:hidden">
          <form onSubmit={submit} className="mb-3 md:hidden">
            <label className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 ring-1 ring-line">
              <Search className="text-mute" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gadgets..." className="w-full bg-transparent text-sm outline-none" />
            </label>
          </form>
          <div className="grid grid-cols-2 gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper">
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
