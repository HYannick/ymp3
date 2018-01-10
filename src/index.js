import Vue from 'vue'
import Home from './Home.vue'
import VueSocketio from 'vue-socket.io';
import config from './config';
Vue.use(VueSocketio, config.socket);
import './scss/main.scss'
// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa')
}
new Vue({
  render: h => h(Home)
}).$mount('#app')