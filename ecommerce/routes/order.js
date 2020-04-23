const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { decreaseQuantity } = require('../controllers/product');
const {
  create,
  listOrders,
  getStatusValues,
  updateOrderStatus,
  orderById,
} = require('../controllers/order');

router.get(
  '/order/status-values/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);
router.put(
  '/order/:orderId/status/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);
router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrders);
router.post(
  '/order/create/:userId',
  requireSignin,
  isAuth,
  addOrderToUserHistory,
  decreaseQuantity,
  create
);
router.param('userId', userById);

router.param('orderId', orderById);
module.exports = router;
