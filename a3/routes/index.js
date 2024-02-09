// routes/index.js
const express = require('express');
const router = express.Router();
const { getNewsData, getExchangeRateData } = require('../controllers/apiController');

router.get('/main', async (req, res) => {
  try {
    const newsResult = await getNewsData('User Request for News Data');
    const exchangeRateResult = await getExchangeRateData('User Request for Exchange Rate Data');

    if (newsResult.success && newsResult.data && Array.isArray(newsResult.data.articles) && newsResult.data.articles.length > 0) {
      res.render('main', {
        newsData: newsResult.data.articles.slice(0, 10),
        exchangeRateData: exchangeRateResult.data.rates,
      });
    } else {
      console.error('Ошибка получения данных о новостях:', newsResult.message);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  } catch (error) {
    console.error('Произошла ошибка:', error);
    res.status(500).send(`Внутренняя ошибка сервера: ${error.message}`);
  }
});

module.exports = router;
