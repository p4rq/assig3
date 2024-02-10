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

// Маршрут для отображения административной панели
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

// Маршрут для обновления данных пользователя
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
      res.redirect('/admin');  // Исправленный путь
  })
  .catch((error) => {
      console.error('Ошибка при обновлении пользователя:', error);
      res.status(500).send('Internal Server Error');
  });
});

// Маршрут для удаления пользователя (устанавливает deletionDate)
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

// Добавь другие маршруты для обновления, удаления и отображения данных пользователей при необходимости

module.exports = router;
