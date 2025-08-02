const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET /api/cart - Kullanıcının sepetini getir
router.get('/', auth, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
      if (!cart) {
        return res.json({ items: [] });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST /api/cart - Sepete ürün ekle
router.post('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) {
        cart = new Cart({ user: req.user.userId, items: [] });
      }
      // Ürün zaten sepette mi?
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        // Varsa miktarını artır
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Yoksa yeni ürün ekle
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // PUT /api/cart - Sepetteki ürünün miktarını değiştir
router.put('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });
      const item = cart.items.find(item => item.product.toString() === productId);
      if (!item) return res.status(404).json({ message: 'Ürün sepette yok' });
      item.quantity = quantity;
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE /api/cart/:productId - Sepetten ürün çıkar
router.delete('/:productId', auth, async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });
      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;