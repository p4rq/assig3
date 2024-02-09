const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.userId && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username isAdmin');
    res.render('admin', { users });  // Pass the list of users to the template
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/addUser', isAdmin, [
  body('username').notEmpty().isString(),
  body('password').notEmpty().isString(),
  body('isAdmin').optional().isBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, isAdmin } = req.body;

    const userExists = await User.exists({ username });

    if (userExists) {
      return res.status(400).send('User with this username already exists');
    }

    const newUser = new User({
      username,
      password,
      userId: generateUserId(), // Assuming generateUserId is defined
      isAdmin: isAdmin || false,
    });

    await newUser.save();
    console.log('User added successfully:', newUser);
    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/deleteUser/:userId', isAdmin, async (req, res) => {
  try {
    console.log('Deleting user with userId:', req.params.userId);

    // Perform user deletion
    await User.deleteOne({ userId: req.params.userId });

    console.log('User deleted successfully');
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updateUser/:userId', isAdmin, async (req, res) => {
  try {
    console.log('Updating user with userId:', req.params.userId);
    
    const { username } = req.body;
    
    // Perform user update
    await User.updateOne({ userId: req.params.userId }, { username });

    console.log('User updated successfully');
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
