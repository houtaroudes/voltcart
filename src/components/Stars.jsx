import { Star } from './Icons.jsx'

export default function Stars({ value = 0, count }) {
  const v = Math.round(value * 2) / 2 // render halves as filled outlines
  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= Math.floor(v) || (i === Math.ceil(v) && v % 1 >= 0.5)} />
        ))}
      </span>
      {typeof count === 'number' && <span className="text-muted">({count.toLocaleString()})</span>}
    </div>
  )
}
