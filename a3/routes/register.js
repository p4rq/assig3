const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid'); // Добавлен импорт для использования библиотеки uuid

// Определение функции генерации ID пользователя
const generateUserId = () => {
  return uuid.v4();
};

// Роут для отображения страницы регистрации
router.get('', (req, res) => {
  res.render('../views/register.ejs', { error: null }); // Определение 'error' как null изначально
});

// Роут для обработки данных формы регистрации
router.post('/', [
  body('username').notEmpty().isString(),
  body('password').notEmpty().isString(),
], async (req, res) => {
  try {
    // Проверка наличия ошибок валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('../views/register.ejs', { error: 'Invalid username or password' });
    }

    const { username, password } = req.body;

    // Хэширование пароля перед сохранением в базу данных
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Создание нового пользователя
    const newUser = new User({
      username,
      password: hashedPassword,
      userId: generateUserId(), // Использование функции generateUserId
      creationDate: new Date(),
      isAdmin: false,
    });

    await newUser.save(); // Сохранение пользователя в базе данных
    res.redirect('/login'); // Перенаправление на страницу входа после успешной регистрации
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
