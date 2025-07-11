const checkDupQueries = require('../db/queries/checkDupQueries');

exports.checkId = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: '아이디를 입력하세요.' });

    // console.log(id);
    const result = await checkDupQueries.checkId(id);
    // console.log(result);
    const count = parseInt(result.cnt, 10); // 숫자로 변환
    // console.log(count);
    return res.status(200).json({ available: count === 0 });
  } catch (error) {
    console.error('checkId error:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    // if (!id) return res.status(400).json({ message: '아이디를 입력하세요.' });

    const result = await checkDupQueries.checkEmail(email);
    const count = parseInt(result.cnt, 10); // 숫자로 변환
    return res.status(200).json({ available: count === 0 });

  } catch (error) {
    console.error('checkEmail error:', error);
    return res.status(500).json({ message: '서버 오류' });
  }
};