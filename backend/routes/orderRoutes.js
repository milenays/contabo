const express = require('express');
const { updateOrderStatusToPicking, getAllOrders, getOrderDetail, createOrder, updateOrder, deleteOrder, changeTyCargo  } = require('../controllers/orderControllers');
const router = express.Router();

router.put('/update-order-status-to-picking', updateOrderStatusToPicking);
router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id').get(getOrderDetail).put(updateOrder).delete(deleteOrder);
router.put('/:shipmentPackageId/change-cargo', changeTyCargo);

module.exports = router;
