interface Stats {
  label: string
  value: string
}

interface Activity {
  type: string
  title: string
  date: string
  status: 'Published' | 'New' | 'Draft'
}

export const DUMMY_STATS: Stats[] = [
  { label: 'Total Services', value: '06' },
  { label: 'Total Portfolios', value: '12' },
  { label: 'Total Blogs', value: '03' },
  { label: 'Total Contacts', value: '04' },
]

export const DUMMY_ACTIVITIES: Activity[] = [
  {
    type: 'Blog',
    title: '"Why Winosa"',
    date: '12/01/2026',
    status: 'Published',
  },
  {
    type: 'Contact',
    title: 'John Doe',
    date: '13/01/2026',
    status: 'New',
  },
  {
    type: 'Portofolio',
    title: 'Project Alpha',
    date: '-',
    status: 'Draft',
  },
  {
    type: 'Portofolio',
    title: 'Project Alpha',
    date: '-',
    status: 'Draft',
  },
]