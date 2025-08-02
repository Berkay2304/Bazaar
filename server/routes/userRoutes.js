const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// POST /api/users/register
router.post('/register', async (req, res) => {
  // Burada kullanıcı oluşturma işlemi olacak
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();

    // Token üret
    const token = generateToken(user);
    
    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Kullanıcıyı email ile bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // 2. Şifreyi kontrol et (şimdilik düz karşılaştırma)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre' });
    }

    // 3. Başarılıysa yanıt döndür
    const token = generateToken(user);
    
    res.json({ message: 'Giriş başarılı', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/me - Kullanıcı bilgilerini al
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;