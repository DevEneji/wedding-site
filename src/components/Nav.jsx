import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { config, navLinks } from '../data/site'

export default function Nav() {
  const [open, setOpen]         = useState(false)
  const [activeHref, setActive] = useState('/#home')
  const [scrolled, setScrolled] = useState(false)
  const ref     = useRef(null)
  const location  = useLocation()
  const navigate  = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return
    const sections = ['home', 'gallery', 'wrapped', 'rsvp']
    const els = sections.map(id => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(`/#${visible.target.id}`)
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0.1, 0.3, 0.6, 0.9] })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname === '/support') setActive('/support')
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    const mq    = window.matchMedia('(min-width: 768px)')
    const onMq  = e => { if (e.matches) setOpen(false) }
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  function handleNav(e, href) {
    e.preventDefault()
    setOpen(false)
    if (href.startsWith('/#')) {
      const id = href.slice(2)
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
  }

  const isActive = href =>
    href === '/support'
      ? location.pathname === '/support'
      : activeHref === href && location.pathname === '/'

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-sand-100/10 bg-teal-950/88 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-gradient-to-b from-teal-950/50 to-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 md:py-5">

        {/* Monogram */}
        <a
          href="/#home"
          onClick={e => handleNav(e, '/#home')}
          className="font-display text-xl font-light tracking-[0.2em] text-sand transition-colors duration-300 hover:text-sand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
        >
          {config.monogram}
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleNav(e, link.href)}
              className={`relative py-2 text-xs font-light uppercase tracking-[0.18em] transition-colors duration-300 ${
                isActive(link.href) ? 'text-sand' : 'text-sand-100/55 hover:text-sand-100'
              } ${link.href === '/support' ? 'ml-2 rounded-full border border-sand-300/25 px-4 hover:border-sand-300/50' : ''}`}
            >
              {link.label}
              {/* Sliding underline — only for non-pill links */}
              {link.href !== '/support' && (
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-sand transition-transform duration-300 ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(s => !s)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-sand-100/10 bg-teal-950/20 backdrop-blur-sm md:hidden"
        >
          <span className={`block h-px w-5 bg-sand-200 transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-sand-200 transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
          <span className={`block h-px w-5 bg-sand-200 transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Backdrop for closing on outside tap */}
      {open && (
        <div
          className="fixed inset-0 top-[4.5rem] -z-10 bg-teal-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        FIX 5: Mobile nav uses max-height transition instead of block/hidden,
        restoring the smooth slide-down animation.
        Links stagger in via CSS animation-delay inline styles, but now
        reference the .animate-nav-slide class defined in index.css
        (a proper @keyframes) rather than an ad-hoc animation string.
      */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`overflow-hidden transition-[max-height,opacity] duration-350 ease-in-out md:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-sand-100/8 bg-teal-950/96 px-6 pb-8 pt-5 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                style={open ? { animation: `nav-slide-down 0.32s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms both` } : {}}
                className={`flex min-h-12 items-center border-b border-sand-100/8 text-sm font-light uppercase tracking-[0.16em] transition-colors hover:text-sand ${
                  isActive(link.href) ? 'text-sand' : 'text-sand-100/65'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
