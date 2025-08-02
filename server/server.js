
const express = require("express");
const cors = require('cors'); 
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Environment variables kontrolü
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not defined');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is not defined');
  process.exit(1);
}

// CORS ayarlarını düzelt
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://bazaar-app-frontend.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
connectDB();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'https://bazaar-app-frontend.vercel.app'}`);
});