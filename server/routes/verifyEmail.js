const express = require('express');
const nodemailer = require('nodemailer');
// const redis = require('redis');
const redisClient = require('../redisClient');
const router = express.Router();
// require('dotenv').config();

// const redisClient = redis.createClient();
// redisClient.connect().catch(console.error);

// 이메일 발송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 인증번호 발송
router.post('/sendVerificationCode', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: '이메일이 없습니다.' });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('발송 라우터 !!');

  try {
    // 인증번호 Redis에 저장 (5분 유효)
    await redisClient.set(`verify:${email}`, verificationCode, {
      EX: 300  // 300초 = 5분
    });

    console.log('Redis 저장 성공');

    // 이메일 전송
    const mailOptions = {
      from: 'kjew03@gmail.com',
      to: email,
      subject: '이메일 인증번호',
      text: `인증번호는 ${verificationCode} 입니다. 5분 내에 입력해주세요.`
    };

    await transporter.sendMail(mailOptions);
    console.log('메일 전송 성공');

    res.json({ message: '인증번호가 발송되었습니다.' });
  } catch (err) {
    console.error(err);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
    res.status(500).json({ message: '이메일 발송 실패' });
  }
});

// 인증번호 검증
router.post('/verifyCode', async (req, res) => {
    const { email, code } = req.body;
  
    try {
      const savedCode = await redisClient.get(`verify:${email}`);
  
      if (!savedCode) {
        return res.status(400).json({ message: '인증번호가 만료되었거나 존재하지 않습니다.' });
      }
  
      if (savedCode !== code) {
        return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' });
      }
  
      // 성공: 필요시 redis에서 삭제 가능
      await redisClient.del(`verify:${email}`);
  
      res.json({ message: '이메일 인증 성공' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '인증 확인 중 오류 발생' });
    }
  });

  module.exports = router;