import { config, galleryImages } from '../data/site'
import { useCountdown } from './useCountdown'

export default function HeroSection() {
  const { days, hours, minutes, seconds, isComplete } = useCountdown(config.date)
  const heroImage = config.heroImage || galleryImages[0]?.src

  const units = [
    ['Days',    days],
    ['Hours',   hours],
    ['Minutes', minutes],
    ['Seconds', seconds],
  ]

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-teal-950"
    >
      {/* ── Background image: single Ken Burns layer ── */}
      {heroImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center animate-ken-burns"
          />
        </div>
      )}

      {/*
        FIX 1: Reduced from 4 stacked overlays to 2.
        - One diagonal gradient that keeps top-left & bottom dark (nav + footer bleed)
        - One bottom fade so content below the fold reads cleanly
        The image remains clearly visible through the centre.
      */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-teal-950/75 via-teal-950/30 to-teal-950/55" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-950 to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 pb-20 pt-32 text-center sm:px-8">
        <div className="max-w-4xl">

          {/*
            FIX 2: Every child now carries a distinct delay-* class.
            Elements cascade in at 75ms intervals — the scene is revealed
            sequentially rather than arriving as a single block.
          */}

          {/* 1 — Event name eyebrow */}
          <p className="animate-fade-up delay-0 text-[10px] font-medium uppercase tracking-[0.45em] text-sand-100/70 sm:text-xs">
            {config.eventName}
          </p>

          {/* 2 — Tagline */}
          <div className="mt-6 overflow-hidden">
            <p className="animate-fade-up delay-75 font-display text-base italic text-sand-200/75 sm:text-lg">
              Together with their families
            </p>
          </div>

          {/* 3 — Names */}
          <h1 className="animate-fade-up delay-150 mt-3 font-display font-light leading-[0.85] tracking-[-0.03em] text-sand-100">
            <span className="block text-[clamp(3.8rem,13vw,8.5rem)]">{config.bride}</span>
            <span className="my-2 block font-display text-[clamp(1.8rem,4.5vw,3.5rem)] italic text-sand-300">
              &amp;
            </span>
            <span className="block text-[clamp(3.8rem,13vw,8.5rem)]">{config.groom}</span>
          </h1>

          {/* 4 — Invitation copy */}
          <p className="animate-fade-up delay-225 mx-auto mt-6 max-w-sm text-sm font-light leading-relaxed text-sand-100/70 sm:text-base">
            request the honour of your presence as they exchange vows
          </p>

          {/* 5 — Date */}
          <p className="animate-fade-up delay-300 mt-3 font-display text-xl italic text-sand-200 sm:text-2xl">
            {config.dateLabel}
          </p>

          {/* 6 — Countdown label */}
          <div className="animate-fade-up delay-375 mx-auto mt-8 flex max-w-xl items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-sand-300/45" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-sand-100/50">
              counting down
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-sand-300/45" />
          </div>

          {/* 7 — Countdown tiles */}
          <div className="animate-fade-up delay-450 mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            {units.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-sand-100/20 bg-teal-950/40 px-2 py-3 backdrop-blur-md sm:px-5 sm:py-4"
              >
                <div className="font-display text-2xl font-light tabular-nums text-sand-100 sm:text-4xl">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-sand-100/50 sm:text-[9px] sm:tracking-[0.28em]">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {isComplete && (
            <p className="mt-5 font-display text-lg italic text-sand-200">
              The day we dreamed of is here.
            </p>
          )}

          {/* 8 — Venue cards */}
          <div className="animate-fade-up delay-525 mt-8 grid gap-3 text-left sm:grid-cols-2">
            {[
              { label: 'Ceremony',  value: config.ceremonyVenue  },
              { label: 'Reception', value: config.receptionVenue },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-sand-100/15 bg-teal-950/40 p-4 backdrop-blur-md"
              >
                <p className="text-[9px] uppercase tracking-[0.3em] text-sand-300/80">{label}</p>
                <p className="mt-1 text-sm font-light text-sand-100/80">{value}</p>
              </div>
            ))}
          </div>

          {/* 9 — Dress code */}
          <p className="animate-fade-up delay-600 mt-5 text-[10px] font-light uppercase tracking-[0.35em] text-sand-100/35">
            Dress — <span className="text-sand-300/60">{config.dressCode}</span>
          </p>
        </div>

        {/* Scroll nudge — FIX 2: now bounces to draw attention */}
        <a
          href="#gallery"
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-sand-100/40 transition-colors hover:text-sand-100/75"
          aria-label="Scroll to gallery"
        >
          {/*<span className="animate-fade-up delay-600">Explore</span>*/}
          <span className="animate-nudge h-9 w-px bg-gradient-to-b from-sand-300/65 to-transparent" />
        </a>
      </div>
    </section>
  )
}
