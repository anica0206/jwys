const findAccountQuery = require('../db/queries/findAccountQueries');
require('dotenv').config();
const nodemailer = require('nodemailer');
const redisClient = require('../redisClient');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

exports.findId = async (req, res) => {
    const { name, email } = req.body;

    try {
        const id = await findAccountQuery.findId(name, email);

        if (!id) {
            return res.status(404).json({ message: '입력하신 정보가 틀렸습니다.' });
        }

        // res.status(200).json({ message: '아이디 찾기 성공', id: id.id });
        res.status(200).json({ message: `찾으시는 아이디는 ${id.id} 입니다.` });
    } catch (err) {
        console.error('findId error:', err);
        res.status(500).send(err.message);
    }
};

exports.findPw = async (req, res) => {
    const { id, email } = req.body;
  
    try {
      const result = await findAccountQuery.findPw(id, email);
  
      if (!result) {
        return res.status(404).json({ message: '해당 정보로 가입된 계정을 찾을 수 없습니다.' });
      }
  
      // 6자리 인증번호 생성
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Redis 저장 (5분)
      await redisClient.set(`verifyPw:${email.trim()}`, verificationCode, { EX: 300 });
      console.log('Redis 저장 성공');
  
      // 메일 발송
      const mailOptions = {
        from: 'kjew03@gmail.com',
        to: email,
        subject: '비밀번호 재설정 인증번호',
        text: `인증번호는 ${verificationCode} 입니다. 5분 내에 입력해주세요.`
      };
  
      await transporter.sendMail(mailOptions);
      console.log('메일 전송 성공');
  
      res.status(200).json({ message: '인증코드를 이메일로 발송했습니다.' });
  
    } catch (err) {
      console.error('findPw error:', err);
      res.status(500).send(err.message);
    }
};

exports.verifyPwCode = async (req, res) => {
    const { email, code } = req.body;
  
    try {
      const savedCode = await redisClient.get(`verifyPw:${email.trim()}`);
      console.log('savedCode:', savedCode, '입력코드:', code);
  
      if (!savedCode) {
        return res.status(400).json({ message: '인증번호가 만료되었거나 존재하지 않습니다.' });
      }
  
      if (savedCode !== code) {
        return res.status(400).json({ message: '인증번호가 일치하지 않습니다.' });
      }
  
      await redisClient.del(`verifyPw:${email.trim()}`);
  
      res.json({ message: '비밀번호 인증 성공' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '인증 확인 중 오류 발생' });
    }
};

exports.resetPw = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await findAccountQuery.resetPw(email, hashedPassword);
    
        res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
    
        } catch (err) {
        console.error('resetPw error:', err);
        res.status(500).send(err.message);
    }
};