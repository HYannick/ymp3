import Vue from 'vue';
import VueCookie from 'vue-cookie';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import Home from './Home.vue'
import VueSocketio from 'vue-socket.io';
import config from './config';
import lang from './lang';
import './scss/main.scss';

Vue.use(VueSocketio, config.socket);
Vue.use(VueI18Next);
Vue.use(VueCookie);

i18next.init({
  lng: window.navigator.userLanguage || window.navigator.language,
  resources: {
    en: {translation: lang.en},
    fr: {translation: lang.fr}
  }
});
console.log(window.navigator.userLanguage || window.navigator.language)
const i18n = new VueI18Next(i18next);
// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}
new Vue({
  i18n,
  render: h => h(Home)
}).$mount('#app')