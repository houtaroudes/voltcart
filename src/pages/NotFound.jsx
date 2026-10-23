import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-20">
      <p className="code text-[clamp(4rem,12vw,9rem)] leading-none text-accent">404</p>
      <div className="mt-6 grid gap-6 border-t-2 border-ink pt-6 md:grid-cols-[1fr_1fr]">
        <h1 className="max-w-[20ch] font-display text-section">This page took a different route</h1>
        <div>
          <p className="max-w-[46ch] text-muted">The link may be old, or the page moved. The shop is still right where you left it.</p>
          <Link to="/" className="btn btn--primary mt-6">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
