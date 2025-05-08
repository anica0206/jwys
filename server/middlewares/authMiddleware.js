const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: '토큰 없음' });

  const token = authHeader.split(' ')[1]; // 'Bearer xxxxx'

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // 토큰 안의 정보 사용 가능
    next();
  } catch (err) {
    res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};
