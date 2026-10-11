import { Star } from './Icons.jsx'

export default function Stars({ value = 0, count }) {
  const v = Math.round(value * 2) / 2 // render halves as filled outlines
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= Math.floor(v) || (i === Math.ceil(v) && v % 1 >= 0.5)} />
        ))}
      </div>
      {typeof count === 'number' && <span className="text-xs text-mute">({count.toLocaleString()})</span>}
    </div>
  )
}
