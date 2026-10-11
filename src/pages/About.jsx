import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">About Voltcart</h1>
      <div className="mt-6 space-y-4 text-mute">
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
      <Link to="/shop" className="mt-8 inline-block rounded-xl bg-volt px-5 py-3 font-semibold text-white hover:bg-volt-deep">Start browsing</Link>
    </div>
  )
}
