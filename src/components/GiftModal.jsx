import { useEffect, useRef, useState } from 'react'
import { bankAccounts, config } from '../data/site'

export default function GiftModal({ onClose, item = null }) {
  const dialogRef      = useRef(null)
  const closeRef       = useRef(null)
  const previousFocus  = useRef(null)
  // copiedId tracks which account number was just copied
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    previousFocus.current = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll(
        'button, a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previousFocus.current?.focus?.()
    }
  }, [onClose])

  /*
    FIX 3: copyAccount now:
    1. Sets copiedId to the account label so the correct button shows "Copied ✓"
    2. Resets after 2s — matching the toast-pop animation duration
  */
  async function copyAccount(accountNumber, label) {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/\s/g, ''))
    } catch {
      // Clipboard unavailable — number is still visible to transcribe
    }
    setCopiedId(label)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-teal-950/85 px-4 py-6"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-modal-title"
        aria-describedby="gift-modal-description"
        tabIndex={-1}
        className="animate-modal-in relative my-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-sand-100/15 bg-gradient-to-b from-teal-900 to-teal-950 p-6 shadow-2xl shadow-black/60 outline-none sm:p-9"
      >
        {/* Ambient glow */}
        <div aria-hidden className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sand-300/12 blur-3xl" />

        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gift details"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-sand-100/15 text-lg text-sand-100/55 transition hover:border-sand-100/40 hover:bg-sand-100/8 hover:text-sand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand"
        >×</button>

        {/* Header */}
        <div className="relative text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sand-300/75">
            A gift of love
          </p>
          <h2
            id="gift-modal-title"
            className="mt-3 font-display text-4xl font-light italic text-sand-100 sm:text-5xl"
          >
            Bless our beginning
          </h2>
          <p
            id="gift-modal-description"
            className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-sand-100/60"
          >
            Your presence is already the greatest gift.
            {item
              ? ` To help with the ${item.name}, you can use either account below.`
              : "If you'd like to contribute to our new home, here's where to send love."
            }
          </p>
        </div>

        {/* Account cards */}
        <div className="relative mt-8 space-y-3">
          {bankAccounts.map(acc => (
            <div
              key={acc.label}
              className="rounded-2xl border border-sand-100/10 bg-teal-950/45 p-5"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand-300/80">{acc.label}</p>
              <dl className="mt-4 space-y-3">

                {/* Bank + Account Name — bumped contrast from /40 → /55 */}
                {[
                  ['Bank',         acc.bank],
                  ['Account Name', acc.accountName],
                ].map(([dt, dd]) => (
                  <div key={dt} className="flex items-center justify-between gap-5">
                    <dt className="text-xs font-light text-sand-100/55">{dt}</dt>
                    <dd className="text-right text-sm font-light text-sand-100/88">{dd}</dd>
                  </div>
                ))}

                {/* Account number row with copy button */}
                <div className="border-t border-sand-100/10 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <dt className="text-[10px] font-light text-sand-100/55">Account Number</dt>
                      <dd className="mt-1 font-body text-lg font-light tabular-nums tracking-wide text-sand">
                        {acc.accountNumber}
                      </dd>
                    </div>

                    {/*
                      FIX 3: Button shows "Copied ✓" with a green tint for 2s,
                      then resets. The toast-pop animation is applied via
                      .animate-toast for a smooth appear → linger → fade out.
                    */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => copyAccount(acc.accountNumber, acc.label)}
                        className={`min-h-11 shrink-0 rounded-full border px-4 text-[10px] uppercase tracking-widest transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand ${
                          copiedId === acc.label
                            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                            : 'border-sand-300/25 text-sand-100/65 hover:border-sand-300/55 hover:text-sand'
                        }`}
                      >
                        {copiedId === acc.label ? 'Copied ✓' : 'Copy'}
                      </button>

                      {/* Floating toast confirmation */}
                      {copiedId === acc.label && (
                        <span
                          aria-live="polite"
                          className="animate-toast pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-400/15 border border-emerald-400/25 px-3 py-1 text-[10px] text-emerald-300"
                        >
                          Copied to clipboard
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* Sign-off */}
        <div className="relative mt-7 border-t border-sand-100/10 pt-6 text-center">
          <p className="font-display text-lg italic text-sand-300">
            With love, {config.bride} &amp; {config.groom}
          </p>
          <p className="mt-2 text-xs font-light text-sand-100/38">
            Thank you for helping us build our home.
          </p>
        </div>
      </div>
    </div>
  )
}
