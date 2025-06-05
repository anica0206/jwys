const signUpQueries = require('../db/queries/signUpQueries');

exports.signUp = async (req, res) => {
  try {
    const newUser = await signUpQueries.signUp(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
