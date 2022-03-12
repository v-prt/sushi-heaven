export const upgrades = [
  // produce more sushi faster
  { id: 'megaCursor', name: 'Mega Cursor', currency: 'sushi', cost: 10, value: 3 },
  { id: 'autoCursor', name: 'Auto Cursor', currency: 'sushi', cost: 100, value: 1 },
  { id: 'jiro', name: 'Jiro', currency: 'sushi', cost: 1500, value: 5 },
  { id: 'farm', name: 'Farm', currency: 'sushi', cost: 20000, value: 30 },
  { id: 'factory', name: 'Factory', currency: 'sushi', cost: 500000, value: 75 },
]

export const restaurants = [
  // buy restaurants with coins to sell sushi for more coins
  { id: 'cart', name: 'Cart', currency: 'coins', cost: 5000, value: 10, stock: '1k' },
  { id: 'truck', name: 'Truck', currency: 'coins', cost: 10000, value: 25, stock: '10k' },
  { id: 'bar', name: 'Bar', currency: 'coins', cost: 25000, value: 100, stock: '100k' },
  {
    id: 'restaurant',
    name: 'Restaurant',
    currency: 'coins',
    cost: 75000,
    value: 300,
    stock: '1m',
  },
  {
    id: 'franchise',
    name: 'Franchise',
    currency: 'coins',
    cost: 2250000,
    value: 600,
    stock: '10m',
  },
]
