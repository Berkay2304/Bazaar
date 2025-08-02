const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/products - Yeni ürün ekle
router.post('/', auth, admin, async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// GET /api/products - Tüm ürünleri listele
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// PUT /api/products/:id - Ürün güncelle
router.put('/:id',auth, admin, async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE /api/products/:id - Ürün sil
router.delete('/:id',auth, admin, async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }
      
      res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;