const db = require('../../dbRoutes');

exports.signUp = async (user) => {
  const result = await db.query(
    'INSERT INTO users (id, name, password) VALUES ($1, $2, $3) RETURNING *',
    [user.id, user.email, user.password]
  );
  return result.rows[0];
};