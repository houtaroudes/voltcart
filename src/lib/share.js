/**
 * Shareable preview links. The product travels in the path and up to two
 * alternatives travel in `compare`, so one URL restores the whole comparison.
 */
export function previewUrl(slug, compareSlugs = []) {
  const extras = [...new Set(compareSlugs.filter((s) => s && s !== slug))].slice(0, 2)
  const path = `/preview/${encodeURIComponent(slug)}`
  const query = extras.length ? `?compare=${extras.map(encodeURIComponent).join(',')}` : ''
  return `${window.location.origin}${path}${query}`
}

/* How long the Clipboard API gets before the selection copy takes over. */
const WRITE_WAIT_MS = 600

/*
 * Copy without ever leaving the button hanging. `writeText` rejects outright
 * when the page is unfocused or the origin is insecure, but some browsers park
 * it behind a permission prompt that may never settle, which used to leave the
 * caller waiting forever and the button looking dead. A short deadline sends
 * that case down the selection path instead.
 */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    const ok = await writeWithin(text, WRITE_WAIT_MS)
    if (ok) return true
  }
  return selectionCopy(text)
}

function writeWithin(text, ms) {
  let timer
  const deadline = new Promise((resolve) => {
    timer = setTimeout(() => resolve(false), ms)
  })
  const attempt = navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  )
  return Promise.race([attempt, deadline]).finally(() => clearTimeout(timer))
}

function selectionCopy(text) {
  try {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.top = '-1000px'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    field.remove()
    return ok
  } catch {
    return false
  }
}
