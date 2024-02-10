const axios = require('axios');
const News = require('../models/news');
const ExchangeRate = require('../models/exchangeRate');
const RequestHistory = require('../models/requestHistory');
const apiKey = '19d5df6d69ca4e3ea78954d7cd51830c'
const getNewsData = async (userRequest) => {
  try {
    const newsApiResponse = await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us`);
    
    // Сохранение данных в MongoDB
    const newsData = new News({
      data: newsApiResponse.data,
      userRequest,
      timestamp: new Date(),
    });
    await newsData.save();

    // Сохранение запроса в истории
    await saveRequestHistory(userRequest, 'News Data');

    return { success: true, message: 'Данные новостей успешно получены и сохранены', data: newsApiResponse.data.articles };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Ошибка при получении данных новостей' };
  }
};

const getExchangeRateData = async (userRequest) => {
    const apiKey = 'fb451f3577efc62b1ab658c1';
    const baseCurrency = 'USD'; // Исходная валюта (тенге)
    const exchangeRateApiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${apiKey}`;
  
    try {
      // Запрос данных о курсах валют
      const exchangeRateApiResponse = await axios.get(exchangeRateApiUrl);
  
      // Сохранение данных в MongoDB
      const exchangeRateData = new ExchangeRate({
        data: exchangeRateApiResponse.data,
        userRequest,
        timestamp: new Date(),
      });
      await exchangeRateData.save();
  
      // Сохранение запроса в истории
      await saveRequestHistory(userRequest, 'Exchange Rate Data');
  
      return { success: true, message: 'Данные курсов валют успешно получены и сохранены' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Ошибка при получении данных курсов валют' };
    }
  };
  

  const saveRequestHistory = async (userRequest, dataType) => {
    try {
      // Сохранение запроса в истории
      const requestHistory = new RequestHistory({
        userRequest,
        dataType,
        timestamp: new Date(),
      });
      await requestHistory.save();
    } catch (error) {
      console.error('Ошибка при сохранении истории запросов:', error);
    }
  };
  
  module.exports = {
    getNewsData,
    getExchangeRateData,
    saveRequestHistory,
  };
