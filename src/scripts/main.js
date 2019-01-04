import Vue from 'vue';
import App from '../../src/app.vue';
import Vuex from 'vuex';
import router from '../router/router';
Vue.use(Vuex)
Vue.config.devtools = ISDEV ? true : false; 
let vm  = new Vue({ // eslint-disable-line
  el: '#app',
  router,
  render: h => h(App)
});
