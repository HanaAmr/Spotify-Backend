const user = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, 'some secret', { expiresIn: '30d' });
};

exports.signUp = async (req, res, next) => {
 const newUser = await user.create(req.body);   //edit body
 
 const token = signToken(newUser._id);

  res.status(200).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }    
  });
};

exports.signIn = async (req, res, next) => {
    const {email, password} = req.body;
    console.log(email + password);

    // if(!email || !password) {
    //     //return error
    // }
    
    const tempUser = await user.findOne({email}).select('+password');
    console.log(tempUser.email + tempUser.password);
    const correct = await tempUser.correctPassword(password, tempUser.password);
    console.log(correct);

    // if(!tempUser || !correct){
    //     //return error
    // }
    
    const token = signToken(tempUser._id);

    res.status(200).json({
        status: 'Success',
        token   
  });
}

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    next();
}

//  const newUser = await user.create({id: "15",
//          name: "mohamed",
//          email: "mohamed@gmail.com",
//          password: "99999999",
//          uri: "lll",
//          href: "jjj"});

// try {
    //   const tempUser = await user.findOne({email: 'mohamed@gmail.com'});
    //   console.log(tempUser);
    //   const token = signToken(tempUser._id);
    // } catch (error) {
    //   console.log('error');
    // }