import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-volt">404</p>
      <h1 className="mt-2 text-2xl font-bold">This page took a different route</h1>
      <p className="mt-2 text-mute">The link may be old, or the page moved. The shop is still right where you left it.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-volt px-5 py-3 font-semibold text-white hover:bg-volt-deep">Back to home</Link>
    </div>
  )
}
