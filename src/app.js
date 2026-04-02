const express      = require('express')
const orderRoutes  = require('./routes/orderRoutes')
const notFound     = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())

// Health check — útil para monitoramento e testes rápidos
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/orders', orderRoutes)

// Middlewares de tratamento de erro (ordem importa)
app.use(notFound)
app.use(errorHandler)

module.exports = app
