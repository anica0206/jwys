require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
