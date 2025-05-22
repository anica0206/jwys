require('dotenv').config();
console.log('DB_PASS from env:', process.env.DB_PASS);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);


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

console.log('DB_PASS:', process.env.DB_PASS);
console.log('type:', typeof process.env.DB_PASS);

