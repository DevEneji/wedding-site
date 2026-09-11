import { useState } from 'react'
import { useAdminAuth } from '../lib/useAdminAuth'
import { useRegistry } from '../lib/useRegistry'
import { config } from '../data/site'

// ─── Login form ────────────────────────────────────────────────────────────
function LoginForm({ onSignIn }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [busy, setBusy]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await onSignIn(email, password)
    if (!result.ok) setError(result.error)
    setBusy(false)
  }

  const inputClass =
    'w-full rounded-xl border border-sand-100/15 bg-teal-950/40 px-4 py-3 text-sm font-light text-sand-100/90 outline-none transition focus:border-sand-300/60 focus:ring-2 focus:ring-sand-300/10 placeholder:text-sand-100/25'

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-950 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-3xl italic text-sand">{config.monogram}</p>
          <h1 className="mt-2 font-display text-2xl font-light text-sand-100">
            Registry Admin
          </h1>
          <p className="mt-2 text-xs font-light text-sand-100/45">
            Sign in to manage your gift registry
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-sand-100/10 bg-teal-900/35 p-7 backdrop-blur-sm"
        >
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-sand py-3 text-sm font-medium uppercase tracking-[0.2em] text-teal-950 transition hover:bg-sand-200 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Add item form ──────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', price: '', category: '', img: '' }

function AddItemForm({ onAdd }) {
  const [form, setForm]   = useState(EMPTY_FORM)
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk]       = useState(false)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setOk(false)
    const result = await onAdd({
      name:     form.name.trim(),
      price:    form.price.trim(),
      category: form.category.trim(),
      img:      form.img.trim(),
    })
    if (!result.ok) { setError(result.error); setBusy(false); return }
    setForm(EMPTY_FORM)
    setOk(true)
    setBusy(false)
    setTimeout(() => setOk(false), 3000)
  }

  const inputClass =
    'w-full rounded-xl border border-sand-100/15 bg-teal-950/40 px-4 py-3 text-sm font-light text-sand-100/90 outline-none transition focus:border-sand-300/50 placeholder:text-sand-100/25'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
            Item Name
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={update}
            placeholder="e.g. Smart Refrigerator"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
            Price
          </label>
          <input
            name="price"
            required
            value={form.price}
            onChange={update}
            placeholder="e.g. ₦850,000"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
            Category
          </label>
          <input
            name="category"
            required
            value={form.category}
            onChange={update}
            placeholder="e.g. Kitchen"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
            Image URL
          </label>
          <input
            name="img"
            required
            value={form.img}
            onChange={update}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300">
          Item added successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-sand px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-teal-950 transition hover:bg-sand-200 disabled:opacity-60"
      >
        {busy ? 'Adding…' : '+ Add Item'}
      </button>
    </form>
  )
}

// ─── Admin dashboard ────────────────────────────────────────────────────────
function AdminDashboard({ session, signOut }) {
  const { items, loading, error, addItem, removeItem } = useRegistry()
  const [removingId, setRemovingId]   = useState(null)
  const [removeError, setRemoveError] = useState(null)

  async function handleRemove(id, name) {
    if (!window.confirm(`Remove "${name}" from the registry?`)) return
    setRemovingId(id)
    setRemoveError(null)
    const result = await removeItem(id)
    if (!result.ok) setRemoveError(result.error)
    setRemovingId(null)
  }

  return (
    <div className="min-h-screen bg-teal-950 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl italic text-sand">{config.monogram}</p>
            <h1 className="mt-1 font-display text-4xl font-light text-sand-100">
              Registry Admin
            </h1>
            <p className="mt-1 text-xs font-light text-sand-100/40">
              Signed in as {session.user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="min-h-10 rounded-full border border-sand-100/15 px-5 text-xs uppercase tracking-widest text-sand-100/50 transition hover:border-sand-100/30 hover:text-sand-100"
          >
            Sign out
          </button>
        </div>

        {/* Add item */}
        <section className="mb-12 rounded-2xl border border-sand-100/10 bg-teal-900/35 p-6 sm:p-8">
          <h2 className="mb-6 font-display text-2xl font-light italic text-sand-100">
            Add a new item
          </h2>
          <AddItemForm onAdd={addItem} />
        </section>

        {/* Current registry */}
        <section>
          <h2 className="mb-6 font-display text-2xl font-light italic text-sand-100">
            Current registry
            <span className="ml-3 font-body text-sm font-light not-italic text-sand-100/40">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </h2>

          {removeError && (
            <p className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {removeError}
            </p>
          )}

          {loading && (
            <p className="text-sm font-light text-sand-100/40">Loading registry…</p>
          )}

          {error && (
            <p className="text-sm font-light text-red-300">
              Error loading registry: {error}
            </p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="text-sm font-light text-sand-100/40">
              No items in the registry yet.
            </p>
          )}

          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-sand-100/10 bg-teal-900/30 p-4 transition hover:border-sand-100/20"
              >
                {/* Thumbnail */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-light text-sand-100">{item.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs font-light tabular-nums text-sand">
                      {item.price}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-sand-100/40">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.id, item.name)}
                  disabled={removingId === item.id}
                  className="min-h-10 shrink-0 rounded-full border border-red-400/20 px-4 text-xs uppercase tracking-widest text-red-300/70 transition hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
                >
                  {removingId === item.id ? 'Removing…' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Page root ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { session, checking, signIn, signOut } = useAdminAuth()

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-teal-950">
        <p className="text-sm font-light text-sand-100/40">Checking session…</p>
      </div>
    )
  }

  if (!session) return <LoginForm onSignIn={signIn} />

  return <AdminDashboard session={session} signOut={signOut} />
}
