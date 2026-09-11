import { useEffect, useRef, useState } from 'react'
import { galleryImages } from '../data/site'

export default function GallerySection() {
  const [selected, setSelected]   = useState(null)
  const [lbKey, setLbKey]         = useState(0)   // forces img re-mount for fade
  const sectionRef                = useRef(null)
  const [revealed, setRevealed]   = useState(false)

  // Trigger card entrance animation once section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Keyboard nav + scroll lock for lightbox
  useEffect(() => {
    if (selected === null) return
    const onKey = e => {
      if (e.key === 'Escape')      { setSelected(null); return }
      if (e.key === 'ArrowRight')  { setSelected(i => { const n = (i + 1) % galleryImages.length; setLbKey(k => k + 1); return n }) }
      if (e.key === 'ArrowLeft')   { setSelected(i => { const n = (i - 1 + galleryImages.length) % galleryImages.length; setLbKey(k => k + 1); return n }) }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  function goTo(dir) {
    setSelected(i => (i + dir + galleryImages.length) % galleryImages.length)
    setLbKey(k => k + 1)
  }

  const layouts = [
    'col-span-2 row-span-2 md:col-span-5 md:row-span-4',
    'col-span-1 row-span-2 md:col-span-3 md:row-span-3',
    'col-span-1 row-span-2 md:col-span-4 md:row-span-4',
    'col-span-1 row-span-2 md:col-span-3 md:row-span-3',
    'col-span-1 row-span-2 md:col-span-4 md:row-span-4',
  ]

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32"
    >
      <div aria-hidden className="absolute right-[-10rem] top-20 h-80 w-80 rounded-full bg-teal-700/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-light uppercase tracking-[0.35em] text-sand-300/70">
              Treasured moments
            </p>
            <h2 className="mt-3 font-display text-5xl font-light italic text-sand-100 md:text-6xl">
              A little of us
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-relaxed text-sand-100/50 md:text-right">
            Five frames from the chapters that brought us here.
          </p>
        </div>

        {/* Grid — cards stagger in on scroll */}
        <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-12 md:auto-rows-[8rem]">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => { setSelected(i); setLbKey(k => k + 1) }}
              style={revealed ? { animation: `card-reveal 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms both` } : { opacity: 0 }}
              className={`group relative overflow-hidden rounded-[1.5rem] border border-sand-100/10 bg-teal-900 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand ${layouts[i % layouts.length]}`}
              aria-label={`View ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              {/* Overlay — lighter than before so image stays vivid */}
              <span className="absolute inset-0 bg-gradient-to-t from-teal-950/65 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
              <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="max-w-[75%] font-display text-lg font-light italic leading-tight text-sand-100 sm:text-xl">
                  {img.alt}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand-100/30 bg-teal-950/30 text-sand-100 backdrop-blur-sm transition-transform group-hover:scale-110">
                  ↗
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-teal-950/96 px-4 py-8 backdrop-blur-lg"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-sand-100/20 text-xl text-sand-100 transition hover:border-sand-100/50 hover:bg-sand-100/10"
            aria-label="Close gallery"
          >×</button>

          <button
            type="button"
            onClick={() => goTo(-1)}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sand-100/20 text-xl text-sand-100 transition hover:bg-sand-100/10 sm:left-6"
            aria-label="Previous image"
          >←</button>

          <figure className="max-h-full max-w-5xl text-center">
            {/*
              FIX — Lightbox image: key prop forces re-mount on navigation,
              triggering the animate-image-in fade+scale on every slide change.
            */}
            <img
              key={lbKey}
              src={galleryImages[selected].src}
              alt={galleryImages[selected].alt}
              className="max-h-[78svh] w-auto max-w-full rounded-2xl object-contain shadow-2xl animate-image-in"
            />
            <figcaption className="mt-4 font-display text-lg italic text-sand-200">
              {galleryImages[selected].alt}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={() => goTo(1)}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sand-100/20 text-xl text-sand-100 transition hover:bg-sand-100/10 sm:right-6"
            aria-label="Next image"
          >→</button>
        </div>
      )}
    </section>
  )
}
