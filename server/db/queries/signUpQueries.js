const db = require('../../dbRoutes');

exports.signUp = async (user) => {
  const result = await db.query(
    `INSERT INTO userstb 
        (id, password, email, name, birth, sex, nation, phone_type, phone_number, address, address_detail, postal_code, email_ad, sms_ad) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
     RETURNING *`,
    [
      user.id,
      user.password,
      user.email,
      user.name,
      user.birth,
      user.sex,
      user.nation,
      user.phoneType,
      user.phone,
      user.address,
      user.addressDetail,
      user.postalCode,
      user.emailAd,
      user.smsAd
    ]
  );

  return result.rows[0];
};
