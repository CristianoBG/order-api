const express = require('express')
const router  = express.Router()
const {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController')

router.post('/',    createOrder)
router.get('/',     listOrders)
router.get('/:id',  getOrder)
router.put('/:id',  updateOrder)
router.delete('/:id', deleteOrder)

module.exports = router
