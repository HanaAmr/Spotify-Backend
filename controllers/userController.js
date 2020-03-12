const user = require('./../models/userModel');

exports.signUp = async (req, res, next) => {
  const newUser = await user.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      user: newUser
    }    
  });
};