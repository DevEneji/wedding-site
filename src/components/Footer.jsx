import { config } from '../data/site'

export default function Footer() {
  return (
    <footer className="px-5 py-16 text-center border-t border-sand-300/10">
      <p className="font-display font-light italic text-3xl text-sand-100 mb-3">
        {config.bride}{' '}
        <span className="text-teal-600 not-italic">&</span>{' '}
        {config.groom}
      </p>
      <p className="font-light text-sm text-sand-100/40 max-w-sm mx-auto leading-relaxed">
        With gratitude, thank you for every message, prayer, and presence you've brought into our story.
      </p>
      <p className="mt-10 text-xs font-light tracking-[0.35em] text-sand-100/25 uppercase">
        {config.eventName} · {new Date(config.date).getFullYear()}
      </p>
    </footer>
  )
}