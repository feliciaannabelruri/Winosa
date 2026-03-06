export interface Service {
  id: string
  title: string
  description: string
  price: string
  status: 'Draft' | 'Published'
  thumbnail: string // untuk upload image nanti
}

export const DUMMY_SERVICES: Service[] = [
  {
    id: '1',
    title: 'IT Consulting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: '5000000',
    status: 'Draft',
    thumbnail: '',
  },
  {
    id: '2',
    title: 'IT Consulting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: '7500000',
    status: 'Published',
    thumbnail: '',
  },
  {
    id: '3',
    title: 'IT Consulting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    price: '10000000',
    status: 'Published',
    thumbnail: '',
  },
]