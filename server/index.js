const express = require('express');
const path = require('path');
const db = require('./db');  // PostgreSQL 연결
const app = express();
const cors = require('cors');

// CORS 미들웨어 추가
app.use(cors());

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../build')));

// API 예시
app.get('/api/users', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// app.get('*') // v4 ✅ 구 버전에서는 문제 없이 작동함
// app.get('*') // v5 ❌ path-to-regexp 문법 충돌 발생
// app.get('{*any}') // v5 ✅ v5 문법에 맞는 와일드카드 형식
// 버전 확인 방법 (터미널,  package.json 확인)

// React 앱으로 라우팅 (중요: *로 정확히 써야 함!)
app.get('/{*any}', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
