import { useState } from 'react'
import { contacts, config } from '../data/site'

function encode(data) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

export default function RSVPSection() {
  const [form, setForm] = useState({
    name: '',
    attending: 'joyfully-accepts',
    guests: '1',
    message: '',
    'bot-field': '',
  })
  const [status, setStatus]       = useState('idle')
  const [submittedName, setName]  = useState('')

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setName(form.name.trim().split(' ')[0] || 'friend')
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'rsvp', ...form }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-sand-100/15 bg-teal-950/30 px-4 py-3 text-sm font-light text-sand-100/90 outline-none transition focus:border-sand-300/60 focus:ring-2 focus:ring-sand-300/10 placeholder:text-sand-100/25'

  return (
    <section id="rsvp" className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32">
      <div aria-hidden className="absolute right-[-12rem] top-20 h-[30rem] w-[30rem] rounded-full bg-sand-300/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-20">

          {/* Left — heading + contacts */}
          <div>
            <p className="text-xs font-light uppercase tracking-[0.35em] text-sand-300/70">
              Kindly respond
            </p>
            <h2 className="mt-3 font-display text-5xl font-light italic text-sand-100 md:text-6xl">
              Will you join us?
            </h2>
            <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-sand-100/55">
              Please let us know by {config.rsvpDeadline}. We'd love to celebrate this beginning with you.
            </p>

            <div className="mt-10 border-t border-sand-100/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand-100/40">Questions?</p>
              <ul className="mt-4 space-y-5">
                {contacts.map(c => (
                  <li key={c.name}>
                    <p className="text-xs font-light text-sand-100/50">{c.name}</p>
                    <a
                      href={`tel:${c.phone.replace(/\s/g, '')}`}
                      className="mt-1 inline-block text-sm font-light tabular-nums text-sand transition hover:text-sand-200"
                    >
                      {c.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form card */}
          <div className="rounded-[2rem] border border-sand-100/10 bg-teal-900/35 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-9">

            {status === 'done' ? (
              /*
                FIX — Success state:
                1. animate-success-in fades the whole panel in (no instant swap)
                2. Uses the guest's first name for a personal touch
                3. Teal ring around checkmark replaced with a warm sand ring
              */
              <div className="animate-success-in flex min-h-[26rem] flex-col items-center justify-center text-center">
                {/* Decorative ring */}
                <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-sand/30 animate-[ping_1.4s_ease-out_0.1s_both]" aria-hidden />
                  <span className="relative flex h-full w-full items-center justify-center rounded-full border border-sand/50 bg-sand/10 text-3xl text-sand">
                    ✓
                  </span>
                </div>
                <p className="font-display text-4xl font-light italic text-sand">
                  See you there, {submittedName}!
                </p>
                <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-sand-100/55">
                  Your response is in. {config.bride} &amp; {config.groom} can't wait to celebrate with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-netlify="true" className="space-y-6">
                <input type="hidden" name="form-name" value="rsvp" />
                <div className="hidden">
                  <label>
                    Don't fill this out
                    <input name="bot-field" value={form['bot-field']} onChange={update} />
                  </label>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="rsvp-name" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
                    Full name
                  </label>
                  <input
                    id="rsvp-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={update}
                    placeholder="Adaeze Obi"
                    className={inputClass}
                  />
                </div>

                {/* Attending — radio cards */}
                <fieldset>
                  <legend className="mb-3 text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
                    Will you attend?
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['joyfully-accepts',    'Joyfully accepts',    'We\'ll be there.'],
                      ['regretfully-declines','Regretfully declines','We\'ll be celebrating from afar.'],
                    ].map(([value, title, copy]) => (
                      <label
                        key={value}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                          form.attending === value
                            ? 'border-sand-300/60 bg-sand/10 shadow-[0_0_0_1px_rgba(201,169,110,0.15)]'
                            : 'border-sand-100/10 bg-teal-950/20 hover:border-sand-100/25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={value}
                          checked={form.attending === value}
                          onChange={update}
                          className="sr-only"
                        />
                        <span className="flex items-start gap-3">
                          <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                            form.attending === value ? 'border-sand bg-sand' : 'border-sand-100/30'
                          }`}>
                            {form.attending === value && <span className="h-1.5 w-1.5 rounded-full bg-teal-950" />}
                          </span>
                          <span>
                            <span className="block text-sm text-sand-100">{title}</span>
                            <span className="mt-1 block text-xs font-light leading-relaxed text-sand-100/40">{copy}</span>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Guest counter — only shown if accepting */}
                {form.attending === 'joyfully-accepts' && (
                  <div>
                    <label htmlFor="rsvp-guests" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
                      Number of guests
                    </label>
                    <div className="flex items-center rounded-xl border border-sand-100/15 bg-teal-950/30">
                      <button
                        type="button"
                        aria-label="Remove one guest"
                        onClick={() => setForm(f => ({ ...f, guests: String(Math.max(1, Number(f.guests) - 1)) }))}
                        className="h-12 w-12 shrink-0 text-xl text-sand-100/50 transition hover:text-sand"
                      >−</button>
                      <input
                        id="rsvp-guests"
                        name="guests"
                        type="number"
                        min="1"
                        max="6"
                        value={form.guests}
                        onChange={update}
                        className="h-12 w-full bg-transparent text-center text-sm text-sand-100 outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Add one guest"
                        onClick={() => setForm(f => ({ ...f, guests: String(Math.min(6, Number(f.guests) + 1)) }))}
                        className="h-12 w-12 shrink-0 text-xl text-sand-100/50 transition hover:text-sand"
                      >+</button>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="rsvp-message" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-sand-100/50">
                    Message <span className="normal-case tracking-normal text-sand-100/30">(optional)</span>
                  </label>
                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update}
                    placeholder="A note for the couple"
                    className={inputClass}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full rounded-xl bg-sand px-5 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-teal-950 transition hover:bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand disabled:cursor-wait disabled:opacity-60"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-teal-900/40 border-t-teal-950 animate-spin" />
                      Sending…
                    </span>
                  ) : 'Send RSVP'}
                </button>

                {status === 'error' && (
                  <p role="alert" className="text-center text-xs font-light text-red-300">
                    Something went wrong — please try again or contact us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
