const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

module.exports = admin;