require('dotenv').config()

const app       = require('./src/app')
const connectDB = require('./src/config/database')

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
      console.log(`📋 Health check: http://localhost:${PORT}/health`)
    })
  })
  .catch((err) => {
    console.error('❌ Falha ao conectar ao banco de dados:', err.message)
    process.exit(1)
  })