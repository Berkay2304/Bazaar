const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// POST /api/orders - Sipariş oluştur
router.post('/', auth, async (req, res) => {
  try {
    // Kullanıcının sepetini bul
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Sepet boş' });
    }

    // Sipariş öğelerini hazırla
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Toplam tutarı hesapla
    const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Sipariş oluştur
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress: req.body.shippingAddress || {}
    });

    await order.save();

    // Sepeti temizle
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/orders - Kullanıcının siparişlerini getir
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 