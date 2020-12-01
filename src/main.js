import Vue from 'vue'

// 初始化样式
import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n // 中英转换

// 全局的样式，包裹layout的布局样式
import '@/styles/index.scss'

// import "viewerjs/dist/viewer.css";

import App from './App.vue'
import store from './store'
import router from './router'


import '@/icons' // icon

// 路由守卫，权限控制
import '@/permission' // permission control


// import Viewer from "v-viewer";

// 打印插件
import Print from '@/utils/print'

ElementUI.Dialog.props.lockScroll.default = false;

// set ElementUI lang to EN // 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI);
Vue.use(Print);
// Vue.use(Viewer);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})



