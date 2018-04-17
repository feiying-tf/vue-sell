<template>
  <div id="app">
    <!-- 引入header组件，并且将seller数据传给header组件 -->
    <v-header :seller="seller"></v-header>
    <div class="tab  border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <!-- keep-alive用来缓存组件，避免多次加载相应的组件，而且还能让页面保持在原来的状态 -->
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
    <!-- <router-view :seller="seller"></router-view> -->
  </div>
</template>

<script>
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/util.js';
  const ERR_OK = 0;
  export default {
    data () {
      return {
        seller: {
          id: (() => {
            let queryParm = urlParse();
            return queryParm.id;
          })()
        }
      };
    },
    // 钩子函数
    created () {
      this.$http.get('/api/seller').then((response) => {
        // 获取一个对象，这个对象的data属性便是里面的内容
        response = response.body;
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    // 注册，让header这个组件作为它的子组件
    components: {
      'v-header': header
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "./common/stylus/mixin.less";
  #app {
    .tab {
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      .border-1px(rgba(7, 17, 27, 0.1));
      .tab-item {
        flex: 1;
        text-align: center;
        a {
          display: block;
          font-size: 14px;
          color: rgb(77, 85, 93);
          &.active {
            color: #f01414;
          }
        }
      }
    }
  }
</style>
