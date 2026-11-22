import Link from 'next/link'

interface DayNavProgressProps {
  currentDay: number
}

export default function DayNavProgress({ currentDay }: DayNavProgressProps) {
  return (
    <nav
      aria-label="Trip day navigation"
      style={{ display: 'flex', gap: 5, margin: '0 0 20px' }}
    >
      {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => (
        <Link
          key={day}
          href={`/day/${day}`}
          aria-label={`Day ${day}`}
          style={{
            height: 4,
            flex: 1,
            background: day === currentDay ? 'var(--coral)' : '#e8e7dc',
            display: 'block',
          }}
        />
      ))}
    </nav>
  )
}
