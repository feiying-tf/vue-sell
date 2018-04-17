// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import './common/stylus/index.less';

Vue.config.productionTip = false;

// 创建和挂载根实例
// 让整个应用都有路由功能，配置完毕后，应用便已经启动了
new Vue({
  // el: '#app',
  router,
  template: '<App/>',
  components: { App },
  // 创建一个新的vue，用于事件的派发，传递数据
  data: {
    eventHub: new Vue()
  }
}).$mount('#app');

// 导航到不同的url，会向history添加一个新的记录
// 所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
// router.push('/goods');
