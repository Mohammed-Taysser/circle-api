import { I18n } from 'i18n';

const i18nMiddleware = new I18n({
  defaultLocale: 'en',
  locales: ['en', 'ar'],
  directory: './src/locales',
});

export default i18nMiddleware.init;
