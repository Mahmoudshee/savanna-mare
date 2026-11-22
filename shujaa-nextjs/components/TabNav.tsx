'use client'

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'big-five',   label: 'Big Five' },
  { id: 'itinerary',  label: 'Itinerary' },
  { id: 'departures', label: 'Departure Dates' },
  { id: 'included',   label: "What's Included" },
  { id: 'about',      label: 'Your Hosts' },
  { id: 'faq',        label: 'FAQs' },
]

interface TabNavProps {
  active: string
  onChange: (id: string) => void
}

export default function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="tab-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={active === tab.id ? 'active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

