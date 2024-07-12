const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const tagRoutes = require('./routes/tagRoutes');
const taxRoutes = require('./routes/taxRoutes');
const variantRoutes = require('./routes/variantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const trendyolRoutes = require('./routes/trendyolRoutes');
const userRoutes = require('./routes/userRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const imageRoutes = require('./routes/imageRoutes');
const tyFetchRoutes = require('./routes/tyFetchRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); // Yeni eklenen route
const todoRoutes = require('./routes/todoRoutes'); // Yeni eklenen route

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/trendyol', trendyolRoutes);
app.use('/api/users', userRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/trendyol', tyFetchRoutes);
app.use('/api/calendar', calendarRoutes); // Yeni eklenen route
app.use('/api/todos', todoRoutes); // Yeni eklenen route

app.use('/uploads', express.static('uploads'));

mongoose
  .connect('mongodb://localhost/stockie', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));