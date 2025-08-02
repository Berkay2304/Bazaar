
const express = require("express");
const cors = require('cors'); 
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
connectDB();

app.use(express.json());
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
});