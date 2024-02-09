const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Login route with input validation
router.get('', (req, res) => {
  res.render('../views/login.ejs', { error: null }); // Define 'error' as null initially
});

router.post('/', [
  body('username').notEmpty().isString(),
  body('password').notEmpty().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors:', errors.array());
      return res.render('../views/login.ejs', { error: 'Invalid username or password' });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('Login Successful:', user);

      req.session.userId = user.userId;
      req.session.isAdmin = user.isAdmin; // Добавим это для сохранения статуса администратора в сессии

      if (user.isAdmin) {
        console.log('Redirecting to Admin Page');
        res.redirect('/admin');
      } else {
        console.log('Redirecting to Main Page');
        res.redirect('/');
      }
    } else {
      console.log('Login Failed');
      res.render('../views/login.ejs', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;