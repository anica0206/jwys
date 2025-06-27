const bcrypt = require('bcrypt');
const signUpQueries = require('../db/queries/signUpQueries');

exports.signUp = async (req, res) => {
  try {
    const { id, password, email, name, birth, sex, nation, phoneType, phone, address, addressDetail, postalCode, emailAd, smsAd } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await signUpQueries.signUp({
      id,
      password: hashedPassword,
      email,
      name,
      birth,
      sex,
      nation,
      phoneType,
      phone,
      address,
      addressDetail,
      postalCode,
      emailAd,
      smsAd
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('회원가입 실패:', err);
    res.status(500).send(err.message);
  }
};
