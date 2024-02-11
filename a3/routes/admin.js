const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

const isAdmin = (req, res, next) => {
  if (req.session.userId && req.session.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', (req, res) => {
  // Найти всех пользователей (не удаленных)
  User.find({ deletionDate: null })
      .then((users) => {
          res.render('admin', { users });
      })
      .catch((error) => {
          console.error('Ошибка при получении пользователей:', error);
          res.status(500).send('Internal Server Error');
      });
});

router.post('/update/:userId', (req, res) => {
  const { newUsername, newUserId, newIsAdmin } = req.body;

  User.findByIdAndUpdate(req.params.userId, {
      username: newUsername,
      userId: newUserId,
      isAdmin: newIsAdmin === 'on',
      updateDate: new Date(),
  })
  .then((updatedUser) => {
      console.log('Пользователь успешно обновлен:', updatedUser);
      res.redirect('/admin');  
  })
  .catch((error) => {
      console.error('Ошибка при обновлении пользователя:', error);
      res.status(500).send('Internal Server Error');
  });
});

router.post('/delete/:userId', (req, res) => {
  User.findByIdAndUpdate(req.params.userId, { deletionDate: new Date() })
      .then((deletedUser) => {
          console.log('Пользователь успешно удален:', deletedUser);
          res.redirect('/admin');
      })
      .catch((error) => {
          console.error('Ошибка при удалении пользователя:', error);
          res.status(500).send('Internal Server Error');
      });
});


module.exports = router;
