require('dotenv').config();

console.log('DB_PASS from env:', process.env.DB_PASS);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);

const express = require('express');
const app = express();
const cors = require('cors');

// app.use(cors());

app.use(cors({
    // origin: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    origin: process.env.REACT_APP_FRONT_API_URL || 'http://134.185.112.116:3000',
    credentials: false,
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const signUpRoutes = require('./routes/signUp');
app.use('/api/signUp', signUpRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
