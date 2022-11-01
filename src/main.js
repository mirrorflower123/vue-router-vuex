import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 饿了么ui部分
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//
import '@/filters/myfilters'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
