const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Register new user

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields')
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })
  const token = generateToken(user._id);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    })
  } else {
    res.status(400)
    throw new Error('Invalid User data')
  }
})
// Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }

})
// Get user data
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
});

// Generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, '9c9ea6cf-0c31-45de-b4f0-376bc89a2403'), {
    expiresIn: '30d',
  }
}
module.exports = {
  registerUser,
  loginUser,
  getMe
}