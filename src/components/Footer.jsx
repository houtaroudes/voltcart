import { Link } from 'react-router-dom'
import { Bolt } from './Icons.jsx'
import { useToast } from '../hooks/use-session-stores.jsx'
import { useState } from 'react'

export default function Footer() {
  const toast = useToast()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return toast.push('That address needs an @ and a domain.', 'error')
    toast.push('Nothing was sent: the newsletter list is not connected yet.', 'error')
    setEmail('')
  }

  return (
    <footer className="mt-[var(--section-gap)] bg-ink text-paper">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <p className="flex items-center gap-2">
              <Bolt className="text-accent" />
              <span className="font-display text-[34px] font-bold leading-none tracking-tight">Voltcart</span>
            </p>
            <p className="mt-4 max-w-[30ch] text-sm text-paper/70">A modern gadget store for tech people. Deal driven, preview friendly, honest specs.</p>
            <p className="mt-6 flex flex-wrap gap-3 text-sm text-paper/70">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>GCash</span>
            </p>
          </div>

          <nav aria-label="Shop links">
            <p className="text-sm font-medium text-paper">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              <li><Link to="/shop" className="hover:text-paper">All products</Link></li>
              <li><Link to="/shop?category=audio" className="hover:text-paper">Audio</Link></li>
              <li><Link to="/shop?category=phones" className="hover:text-paper">Phones</Link></li>
              <li><Link to="/shop?category=smart-home" className="hover:text-paper">Smart Home</Link></li>
            </ul>
          </nav>

          <nav aria-label="Company links">
            <p className="text-sm font-medium text-paper">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              <li><Link to="/about" className="hover:text-paper">About Voltcart</Link></li>
              <li><Link to="/about#shipping" className="hover:text-paper">Shipping policy</Link></li>
              <li><Link to="/about#returns" className="hover:text-paper">Returns</Link></li>
              <li><Link to="/wishlist" className="hover:text-paper">Wishlist</Link></li>
            </ul>
          </nav>

          <div>
            <p className="text-sm font-medium text-paper">Newsletter</p>
            <p className="mt-4 text-sm text-paper/70">One email a week: the real price drops, no noise.</p>
            <form onSubmit={subscribe} className="mt-4 flex">
              <label className="flex-1">
                <span className="visually-hidden">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="field h-12 border-r-0 border-paper bg-ink text-paper placeholder:text-paper/50"
                />
              </label>
              <button type="submit" className="btn h-12 min-h-0 border-paper bg-paper px-5 text-ink hover:bg-paper/85">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-paper/25 pt-5 text-sm text-paper/60">
          <p>(c) 2026 Voltcart. A demo storefront built by Bryan Sacueza. No real payments yet.</p>
          <p>Product photographs from Unsplash.</p>
        </div>
      </div>
    </footer>
  )
}
