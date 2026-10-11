import { Link } from 'react-router-dom'
import { Bolt } from './Icons.jsx'
import { useToast } from '../hooks/use-session-stores.jsx'
import { useState } from 'react'

export default function Footer() {
  const toast = useToast()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return toast.push('Enter a valid email address', 'rose')
    toast.push('Subscribed! Deals land in your inbox soon.')
    setEmail('')
  }

  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-volt text-white"><Bolt /></span>
            Voltcart
          </p>
          <p className="mt-3 text-sm text-white/70">A modern gadget store for tech people. Deal driven, preview friendly, honest specs.</p>
          <div className="mt-4 flex gap-3 text-sm text-white/70">
            <span>VISA</span><span>Mastercard</span><span>PayPal</span><span>GCash</span>
          </div>
        </div>
        <nav aria-label="Shop links">
          <p className="font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/shop" className="hover:text-white">All products</Link></li>
            <li><Link to="/shop?category=audio" className="hover:text-white">Audio</Link></li>
            <li><Link to="/shop?category=phones" className="hover:text-white">Phones</Link></li>
            <li><Link to="/shop?category=smart-home" className="hover:text-white">Smart Home</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company links">
          <p className="font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About Voltcart</Link></li>
            <li><Link to="/about" className="hover:text-white">Shipping policy</Link></li>
            <li><Link to="/about" className="hover:text-white">Returns</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </nav>
        <div>
          <p className="font-semibold">Newsletter</p>
          <p className="mt-3 text-sm text-white/70">One email a week: the real price drops, no noise.</p>
          <form onSubmit={subscribe} className="mt-3 flex overflow-hidden rounded-xl ring-1 ring-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/40"
            />
            <button type="submit" className="bg-volt px-4 text-sm font-semibold hover:bg-volt-deep">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        (c) 2026 Voltcart. A demo storefront built by Bryan Sacueza. No real payments yet.
      </div>
    </footer>
  )
}
