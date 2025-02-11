import { Hono } from 'hono'

import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <title>JLPT Practice</title>
        </head>
        <body>
          <div id="app">{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/', c => {
  return c.render(<h1>Hello JLPT Practice!</h1>)
})

export default {
  port: 3001,
  fetch: app.fetch,
}
