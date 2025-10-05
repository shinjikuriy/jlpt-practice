import { serve } from 'bun'
import homepage from '../client/index.html'

const server = serve({
  hostname: 'localhost',
  development: {
    hmr: true,
  },
  routes: {
    '/': homepage,
  },
})

console.log(`Server is running on ${server.url}`)
