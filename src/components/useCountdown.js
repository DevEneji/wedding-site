import { useEffect, useState } from 'react'

function getRemaining(targetDate) {
  const target = Date.parse(targetDate)
  if (Number.isNaN(target)) return 0
  return Math.max(target - Date.now(), 0)
}

export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate))

  useEffect(() => {
    const update = () => setRemaining(getRemaining(targetDate))
    update()

    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const isComplete = remaining === 0

  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
    isComplete,
  }
}
