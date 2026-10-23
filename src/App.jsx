import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CompareDrawer from './components/CompareDrawer.jsx'
import RecentlyViewed from './components/RecentlyViewed.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Preview from './pages/Preview.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        first.current = false
        return
      }
    }
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const showExtras =
    pathname === '/' || pathname.startsWith('/product') || pathname.startsWith('/shop') || pathname.startsWith('/preview')

  return (
    <div className="flex min-h-full flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/preview/:slug" element={<Preview />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showExtras && <RecentlyViewed />}
      {showExtras && <CompareDrawer />}
      <Footer />
    </div>
  )
}
