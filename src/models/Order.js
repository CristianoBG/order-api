const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  quantity:  { type: Number, required: true, min: [1, 'Quantidade mínima é 1'] },
  price:     { type: Number, required: true, min: [0, 'Preço não pode ser negativo'] }
})

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type:     String,
      required: [true, 'orderId é obrigatório'],
      unique:   true,
      trim:     true
    },
    value: {
      type:     Number,
      required: [true, 'value é obrigatório'],
      min:      [0, 'Valor não pode ser negativo']
    },
    creationDate: {
      type:    Date,
      default: Date.now
    },
    items: {
      type:     [itemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message:   'O pedido deve ter ao menos 1 item'
      }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
