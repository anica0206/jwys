// server/db.js
require('dotenv').config();        // .env 로드
const { Pool } = require('pg');    // pg 모듈 사용 예시

const pool = new Pool({
    user: process.env.DB_USER,       // .env 에 설정한 값
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    max: 20,                         // 풀 크기 설정
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.connect()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;