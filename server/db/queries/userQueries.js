const db = require('../../dbRoutes');

exports.getAllUsers = async () => {
  const result = await db.query('SELECT * FROM USERSTB');
  return result.rows;
};

exports.createUser = async (user) => {
  const result = await db.query(
    'INSERT INTO USERSTB (name, email) VALUES ($1, $2) RETURNING *',
    [user.name, user.email]
  );
  return result.rows[0];
};
