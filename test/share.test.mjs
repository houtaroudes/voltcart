import test from 'node:test'
import assert from 'node:assert/strict'
import { copyText, previewUrl } from '../src/lib/share.js'

/*
 * `copyText` only touches `navigator.clipboard` and a throwaway textarea, so a
 * pair of small fakes covers every branch without a DOM dependency.
 */
function installClipboard(writeText) {
  Object.defineProperty(globalThis, 'navigator', {
    value: { clipboard: { writeText } },
    configurable: true,
    writable: true,
  })
}

function installDocument() {
  const fields = []
  const counts = { exec: 0 }
  globalThis.document = {
    createElement: () => {
      const field = { value: '', style: {}, setAttribute() {}, select() {}, remove() {} }
      fields.push(field)
      return field
    },
    body: { appendChild() {} },
    execCommand(command) {
      counts.exec += 1
      return command === 'copy'
    },
  }
  return { fields, counts }
}

test.afterEach(() => {
  delete globalThis.navigator
  delete globalThis.document
})

test('copyText uses the Clipboard API when the write resolves', async () => {
  const dom = installDocument()
  let written = null
  installClipboard(async (text) => {
    written = text
  })

  assert.equal(await copyText('https://example.test/preview/nova-x5'), true)
  assert.equal(written, 'https://example.test/preview/nova-x5')
  assert.equal(dom.counts.exec, 0, 'the selection copy should not run')
})

test('copyText falls back to the selection copy when the write is rejected', async () => {
  const dom = installDocument()
  installClipboard(async () => {
    throw new Error('NotAllowedError')
  })

  assert.equal(await copyText('https://example.test/preview/titan'), true)
  assert.equal(dom.counts.exec, 1)
  assert.equal(dom.fields[0].value, 'https://example.test/preview/titan')
})

test('copyText stops waiting on a write that never settles', async () => {
  const dom = installDocument()
  installClipboard(() => new Promise(() => {}))

  const started = Date.now()
  assert.equal(await copyText('https://example.test/preview/pulse'), true)
  const elapsed = Date.now() - started

  assert.equal(dom.counts.exec, 1)
  assert.equal(dom.fields[0].value, 'https://example.test/preview/pulse')
  assert.ok(elapsed >= 500, `gave the clipboard the full deadline (${elapsed}ms)`)
  assert.ok(elapsed < 3000, `did not hang on the clipboard (${elapsed}ms)`)
})

test('previewUrl keeps the product in the path and two alternatives in the query', () => {
  const original = globalThis.window
  globalThis.window = { location: { origin: 'https://voltcart.test' } }
  try {
    assert.equal(
      previewUrl('nova-x5', ['pulse-dot', 'titan', 'extra', 'nova-x5']),
      'https://voltcart.test/preview/nova-x5?compare=pulse-dot,titan',
    )
    assert.equal(previewUrl('nova-x5'), 'https://voltcart.test/preview/nova-x5')
  } finally {
    if (original === undefined) delete globalThis.window
    else globalThis.window = original
  }
})
