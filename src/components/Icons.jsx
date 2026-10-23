/**
 * Tiny inline icon set so the app has no icon dependency. Every icon is a
 * 24x24 stroke drawing that inherits currentColor and hides itself from
 * assistive tech, because the label always sits on the control around it.
 */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Search = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
)
export const User = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></svg>
)
export const Heart = ({ filled, ...p }) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill={filled ? 'currentColor' : 'none'} {...base} {...p}><path d="M12 21C7 16.6 3 13.4 3 9.2 3 6.4 5.2 4 8 4c1.7 0 3.2.8 4 2.2C12.8 4.8 14.3 4 16 4c2.8 0 5 2.4 5 5.2 0 4.2-4 7.4-9 11.8Z" /></svg>
)
export const Cart = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.9a2 2 0 0 0 2-1.6L21.5 9H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></svg>
)
export const Bolt = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}><path d="M13 2 4.5 14H10l-1.5 8L18 10h-5.5L13 2Z" /></svg>
)
export const Star = ({ filled, ...p }) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="14" height="14" fill={filled ? 'currentColor' : 'none'} {...base} {...p}><path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" /></svg>
)
export const Eye = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
)
export const Scale = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M12 3v18M5 7h14M5 7 3 13a3 3 0 0 0 4 0L5 7Zm14 0-2 6a3 3 0 0 0 4 0l-2-6Z" /></svg>
)
export const X = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const Chevron = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
)
export const Truck = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M1 7h13v10H1zM14 10h4l3 3v4h-7" /><circle cx="6" cy="19" r="2" /><circle cx="17" cy="19" r="2" /></svg>
)
export const Shield = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z" /></svg>
)
export const Refresh = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>
)
export const Menu = (p) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
