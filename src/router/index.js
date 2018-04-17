import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// import header from '@/components/header/header';
import goods from '@/components/goods/goods';
import seller from '@/components/seller/seller';
import ratings from '@/components/ratings/ratings';
// 注，这儿的@是webpack.base.conf.js中定义的别名，相当于../src
// 进行注册
Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  // 每个路由应该映射一个组件
  routes: [
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    }
  ]
});
export default router;
