import { useState } from 'react'
import { galleryImages, tracks } from '../data/site'

export default function WrappedSection() {
  const [index, setIndex] = useState(0)
  // chapterKey forces a re-render of the text panel, triggering animate-chapter-in
  const [chapterKey, setChapterKey] = useState(0)

  const track = tracks[index]
  const image = track.image || galleryImages[index % galleryImages.length]?.src

  function go(direction) {
    setIndex(current => (current + direction + tracks.length) % tracks.length)
    setChapterKey(k => k + 1)
  }

  function jumpTo(i) {
    if (i === index) return
    setIndex(i)
    setChapterKey(k => k + 1)
  }

  return (
    <section
      id="wrapped"
      className="relative overflow-hidden border-y border-sand-100/10 bg-gradient-to-b from-teal-900/70 to-teal-950 px-5 py-24 sm:px-8 md:py-32"
    >
      <div aria-hidden className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-teal-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-light uppercase tracking-[0.35em] text-sand-300/70">
            2020 — 2026 · Six chapters
          </p>
          <h2 className="mt-3 font-display text-5xl font-light italic text-sand-100 md:text-6xl">
            Our story
          </h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-sand-100/55">
            Every beginning has a moment. Here are a few of ours.
          </p>
        </div>

        {/* Player card */}
        <div className="grid overflow-hidden rounded-[2rem] border border-sand-100/10 bg-teal-950/60 shadow-2xl shadow-black/30 md:grid-cols-[1.05fr_0.95fr]">

          {/* Left — image panel */}
          <div className="relative min-h-[24rem] overflow-hidden md:min-h-[38rem]">
            <img
              key={image}
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover animate-image-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/75 via-transparent to-teal-950/10" />
            {/* Large track watermark */}
            <div className="absolute left-6 top-6 font-display text-8xl font-light leading-none text-sand-100/20 md:left-10 md:top-10 md:text-[10rem]">
              {track.track}
            </div>
            {/* Year + title on image */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10">
              <p className="text-[10px] uppercase tracking-[0.35em] text-sand-200/70">{track.year}</p>
              <p className="mt-2 font-display text-3xl italic text-sand-100 md:text-4xl">{track.title}</p>
            </div>
          </div>

          {/* Right — text panel */}
          <div className="flex flex-col justify-between p-7 sm:p-10 md:p-12">
            <div>

              {/*
                FIX 7: Progress dots now have THREE visual states:
                - Past:    sand/40 — muted fill, shorter bar
                - Active:  sand — full brightness, taller bar with pulse ring
                - Future:  sand-100/15 — almost invisible
              */}
              <div className="mb-8 flex gap-1.5" aria-label="Story chapters">
                {tracks.map((t, i) => {
                  const isPast    = i < index
                  const isCurrent = i === index
                  const isFuture  = i > index
                  return (
                    <button
                      key={t.track}
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-label={`Go to chapter ${i + 1}: ${t.title}`}
                      aria-current={isCurrent ? 'step' : undefined}
                      className="group flex-1 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand"
                    >
                      <span className="relative block overflow-hidden rounded-full">
                        {/* Track base */}
                        <span className={`block rounded-full transition-all duration-400 ${
                          isCurrent ? 'h-[5px] bg-sand shadow-[0_0_8px_rgba(201,169,110,0.7)]'
                          : isPast   ? 'h-[3px] bg-sand/45'
                          :            'h-[3px] bg-sand-100/15 group-hover:bg-sand-100/30'
                        }`} />
                      </span>
                    </button>
                  )
                })}
              </div>

              {/*
                FIX 4: key={chapterKey} forces this div to remount on every
                chapter change, triggering animate-chapter-in each time.
                Both image (left) and text (right) now animate in sync.
              */}
              <div key={chapterKey} className="animate-chapter-in">
                <p className="text-xs uppercase tracking-[0.3em] text-sand-300">
                  Chapter {index + 1}
                </p>
                <h3 className="mt-3 font-display text-4xl font-light italic text-sand-100 md:text-5xl">
                  {track.title}
                </h3>
                <p className="mt-6 text-sm font-light leading-7 text-sand-100/70 md:text-base">
                  {track.body}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex items-center justify-between border-t border-sand-100/10 pt-6">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="min-h-11 text-xs uppercase tracking-widest text-sand-100/50 transition hover:text-sand disabled:pointer-events-none disabled:opacity-25"
              >
                ← Prev
              </button>
              <span className="text-xs tabular-nums text-sand-100/35">
                {String(index + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === tracks.length - 1}
                className="min-h-11 text-xs uppercase tracking-widest text-sand transition hover:text-sand-200 disabled:pointer-events-none disabled:opacity-25"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
