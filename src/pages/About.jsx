import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container py-16">
      <div className="grid gap-10 border-t-2 border-ink pt-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="font-display text-display-s">About Voltcart</h1>
          <Link to="/shop" className="btn btn--primary mt-8">
            Start browsing
          </Link>
        </div>

        <div className="space-y-5 text-muted lg:col-span-6 lg:col-start-7">
          <p>
            Voltcart is a demo storefront built to show how an online gadget shop can feel without the usual noise: a live deal zone with honest countdowns, product cards that preview in place, and a compare drawer that puts real specs side by side.
          </p>
          <p>
            The catalog is seeded with around thirty realistic products across phones, audio, wearables, laptops, accessories and smart home. Everything you add to the cart or wishlist is saved in your browser only, and checkout is a coming-soon stub: no payments are processed here.
          </p>
          <p>
            Built with React, Vite and Tailwind on top of Supabase, deployed on Vercel. Part of the MyProjects collection by Bryan Sacueza.
          </p>
        </div>
      </div>

      <section id="shipping" className="mt-14 max-w-[62ch] scroll-mt-24 border-t-2 border-ink pt-6">
        <h2 className="font-display text-xl">Shipping policy</h2>
        <p className="mt-2 text-muted">
          Orders over P1,500 ship free. Below that, shipping is a flat P150. In-stock gadgets leave the warehouse in one to two days.
        </p>
      </section>

      <section id="returns" className="mt-8 max-w-[62ch] scroll-mt-24 border-t border-rule pt-6">
        <h2 className="font-display text-xl">Returns</h2>
        <p className="mt-2 text-muted">
          Seven days from delivery, unopened or not working. Every gadget in the catalog also carries a two-year warranty.
        </p>
      </section>
    </div>
  )
}
