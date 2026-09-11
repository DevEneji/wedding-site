import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GiftModal from '../components/GiftModal'
import { registryItems, config } from '../data/site'

const bentoPattern = [
  'md:col-span-2 md:row-span-2', // featured
  '',
  '',
  'md:col-span-2',
  'md:row-span-2',
  '',
  'md:col-span-2',
  '',
  '',
]

const imgHeights = [
  'h-72 md:h-80',
  'h-56 md:h-52',
  'h-56 md:h-52',
  'h-60 md:h-56',
  'h-60 md:h-[28rem]',
  'h-56 md:h-52',
  'h-60 md:h-56',
  'h-56 md:h-52',
  'h-56 md:h-52',
]

export default function SupportPage() {
  const [modalOpen, setModalOpen]     = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filter, setFilter]           = useState('All')
  // filterKey changes on every filter switch, triggering re-animation of items
  const [filterKey, setFilterKey]     = useState(0)

  const categories = ['All', ...new Set(registryItems.map(i => i.category))]
  const filtered   = filter === 'All'
    ? registryItems
    : registryItems.filter(i => i.category === filter)

  function handleFilter(cat) {
    if (cat === filter) return
    setFilter(cat)
    setFilterKey(k => k + 1)
  }

  function openGift(item = null) {
    setSelectedItem(item)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-teal-950">
      <Nav />

      <main className="overflow-hidden pt-28">

        {/* Page header */}
        <section className="relative px-5 pb-16 text-center sm:px-8 md:pb-20">
          <div aria-hidden className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-sand-300/8 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-sand-300/75">
              A gift of love
            </p>
            <h1 className="mt-3 font-display text-6xl font-light italic leading-none text-sand-100 sm:text-7xl">
              Gift Registry
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-sand-100/55">
              As {config.bride} and {config.groom} build their first home together, these are a few things
              they'll treasure. Choose an item or simply send a gift from the heart.
            </p>
            <button
              type="button"
              onClick={() => openGift(null)}
              className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-sand px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-teal-950 shadow-lg shadow-sand/10 transition hover:bg-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
            >
              <span>Gift the couple</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </section>

        {/* Sticky category filter */}
        <div className="sticky top-[4.5rem] z-30 border-y border-sand-100/10 bg-teal-950/88 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div
            className="mx-auto flex max-w-6xl gap-2 overflow-x-auto scrollbar-hide pb-1"
            role="tablist"
            aria-label="Registry categories"
          >
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                onClick={() => handleFilter(cat)}
                className={`min-h-10 shrink-0 rounded-full border px-5 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${
                  filter === cat
                    ? 'border-sand bg-sand text-teal-950 shadow-sm shadow-sand/20'
                    : 'border-sand-100/15 text-sand-100/50 hover:border-sand-100/30 hover:text-sand-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento grid */}
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[12rem]">
            {/*
              FIX 6: filterKey changes on every filter switch.
              Each item carries an inline animation with staggered delay,
              re-triggered because the parent key changes force remounts.

              FIX 8: Gradient overlay reduced from from-teal-950/95 to
              from-teal-950/72 — images retain colour in the lower third
              while text remains readable.

              Also: the entire card is now clickable (onClick on article),
              not just the small "Gift this" pill. Larger tap target.
            */}
            {filtered.map((item, i) => {
              const patternIdx  = i % bentoPattern.length
              const spanClass   = bentoPattern[patternIdx]
              const heightClass = imgHeights[patternIdx]
              const isFeatured  = patternIdx === 0

              return (
                <article
                  key={`${filterKey}-${item.id}`}
                  style={{ animation: `item-in 0.32s cubic-bezier(0.22,1,0.36,1) ${i * 45}ms both` }}
                  className={`group relative cursor-pointer overflow-hidden rounded-[1.5rem] border bg-teal-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${
                    isFeatured
                      ? 'border-sand-300/20 shadow-md shadow-black/10'
                      : 'border-sand-100/10'
                  } ${spanClass}`}
                  onClick={() => openGift(item)}
                >
                  <div className={`relative ${heightClass} overflow-hidden`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />

                    {/* FIX 8: lighter overlay — image colour preserved */}
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-950/72 via-teal-950/15 to-transparent" />

                    {/* Category pill */}
                    <span className="absolute left-4 top-4 rounded-full border border-sand-100/15 bg-teal-950/65 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-sand-100/65 backdrop-blur-sm">
                      {item.category}
                    </span>

                    {/* Featured badge */}
                    {isFeatured && (
                      <span className="absolute right-4 top-4 rounded-full border border-sand-300/30 bg-sand/15 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-sand backdrop-blur-sm">
                        Featured
                      </span>
                    )}

                    {/* Item info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="font-display text-2xl font-light leading-tight text-sand-100">
                        {item.name}
                      </h2>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-light tabular-nums text-sand">{item.price}</p>
                        <span
                          className="min-h-10 rounded-full border border-sand-100/30 bg-teal-950/40 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-sand-100 backdrop-blur-sm transition group-hover:border-sand group-hover:text-sand"
                          aria-hidden="true"
                        >
                          Gift this
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mx-auto mt-16 max-w-2xl border-t border-sand-100/10 pt-12 text-center">
            <p className="font-display text-3xl font-light italic text-sand-100/75">
              Or simply give from the heart.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-sand-100/45">
              No gift is expected. Your presence, prayers and good wishes are more than enough.
            </p>
            <button
              type="button"
              onClick={() => openGift(null)}
              className="mt-7 min-h-11 rounded-full border border-sand-300/30 px-7 py-3 text-xs uppercase tracking-[0.2em] text-sand transition hover:bg-sand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sand"
            >
              See account details
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {modalOpen && (
        <GiftModal
          item={selectedItem}
          onClose={() => { setModalOpen(false); setSelectedItem(null) }}
        />
      )}
    </div>
  )
}
