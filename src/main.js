import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import movable from 'v-movable'
Vue.config.productionTip = false
Vue.use(movable)

axios.defaults.baseURL = 'http://send.flowgate.ru/'

const vm1 = new Vue({
  render: h => h(App),
}).$mount('#app')

export default vm1;