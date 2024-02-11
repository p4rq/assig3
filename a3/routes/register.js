const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const generateUserId = () => {
  return uuid.v4();
};

router.get('', (req, res) => {
  res.render('../views/register.ejs', { error: null }); 
});

router.post('/', [
  body('username').notEmpty().isString(),
  body('password').notEmpty().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('../views/register.ejs', { error: 'Invalid username or password' });
    }

    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      userId: generateUserId(),
      creationDate: new Date(),
      isAdmin: false,
    });

    await newUser.save();
    res.redirect('/login'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
