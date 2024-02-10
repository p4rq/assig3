const i18next = require('i18next');
const Backend = require('i18next-http-backend');
const i18nextMiddleware = require('i18next-express-middleware');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    ns: ['translations'],
    defaultNS: 'translations',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/{{lng}}/{{ns}}.missing.json', // Add this line
    },
  });

module.exports = i18next;
