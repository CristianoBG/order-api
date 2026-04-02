const Order = require('../models/Order')

/**
 * Mapeia o payload recebido (campos em PT-BR) para o schema interno.
 * Mantém compatibilidade com sistemas externos que enviam dados em português.
 */
function mapOrder(data) {
  return {
    orderId:      data.numeroPedido,
    value:        data.valorTotal,
    creationDate: data.dataCriacao,
    items:        data.items.map((item) => ({
      productId: Number(item.idItem),
      quantity:  item.quantidadeItem,
      price:     item.valorItem
    }))
  }
}

function validatePayload(data) {
  const errors = []

  if (!data.numeroPedido)
    errors.push('numeroPedido é obrigatório')

  if (data.valorTotal === undefined || data.valorTotal === null)
    errors.push('valorTotal é obrigatório')

  if (!Array.isArray(data.items) || data.items.length === 0)
    errors.push('items deve ser um array com ao menos 1 item')

  return errors
}

// POST /orders
const createOrder = async (req, res, next) => {
  try {
    const errors = validatePayload(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors })
    }

    const order = await Order.create(mapOrder(req.body))
    return res.status(201).json(order)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Já existe um pedido com este ID' })
    }
    next(err)
  }
}

// GET /orders
const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    return res.json({ total: orders.length, orders })
  } catch (err) {
    next(err)
  }
}

// GET /orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }
    return res.json(order)
  } catch (err) {
    next(err)
  }
}

// PUT /orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const errors = validatePayload(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Dados inválidos', details: errors })
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      mapOrder(req.body),
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    return res.json(order)
  } catch (err) {
    next(err)
  }
}

// DELETE /orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.id })
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }
    return res.json({ message: 'Pedido deletado com sucesso' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createOrder, listOrders, getOrder, updateOrder, deleteOrder }
