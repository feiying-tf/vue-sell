<template>
  <div class="header">
    <div class="content-wrapper" ref="contentWrapper">
      <!-- 商家头像 -->
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <!-- 内容部分 -->
      <div class="content">
        <!-- 商店名称 -->
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送到
        </div>
        <!-- 如果seller.supports为undefiend，那么后面这一段就不会解析 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span><i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 模糊背景开始 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 模糊背景结束 -->

    <!-- 遮蔽层开始 -->
    <div v-show="detailShow" class="detail">
      <!-- 模糊背景 -->
      <div class="detailShow-bg"></div>

      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <!-- star组件导入 -->
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <!-- 优惠信息-->
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <!-- 列表信息 -->
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item, index) in seller.supports" :key = "item.id">
              <span>{{index}}</span>
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <!-- 商家公告 -->
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <!-- 公告信息 -->
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="closeDetail">
        <i class="icon-close"></i>
      </div>
    </div>
    <!-- 遮蔽层结束 -->
  </div>
</template>
<script>
  import star from '../star/star.vue';
  export default {
    // 用于接收父组件的数据，可以是简单数组，也可以是对象
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail () {
        this.detailShow = true;
      },
      closeDetail () {
        this.detailShow = false;
      }
    },
    // 在实例创建完成以后立即被调用
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // 进行注册，让star这个组件作为它的子组件
    components: {
      star
    }
  };
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/mixin.less";
  .header {
    position: relative;
    color: #fff;
    background: rgba(7, 17, 27, .5);
    overflow: hidden;
    .content-wrapper {
      position: relative;
      padding: 24px 12px 18px 24px;
      //解决avatar和content之间的又一些空白字符引起的间隙
      //设置以后必须在avatar与content中设置字体大小，要不然会继承font=0
      font-size: 0;
      .avatar {
        display: inline-block;
        background-color: pink;
        vertical-align: top;
        img {
          border-radius: 2px;
        }
      }
      .content {
        display: inline-block;
        margin-left: 16PX;
        font-size: 14px;
        // background-color: blue;
        .title {
          margin: 2px 0 8px 0;
          .brand {
            display: inline-block;
            vertical-align: top;
            width: 30px;
            height: 18px;
            .bg-image('images/brand');
            background-size: 30px 18px;
            background-repeat: no-repeat;
          }
          .name {
            margin-left: 6px;
            font-size: 16px;
            line-height: 18px;
            font-weight: bold;
          }
        }
        .description {
          margin-bottom: 10px;
          line-height: 12px;
          font-size: 12px;
        }
        .support {
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            height: 12px;
            margin-right: 4px;
            background-size: 12px 12px;
            background-repeat: no-repeat;
            &.decrease {
              .bg-image('images/decrease_1');
            }
            &.discount {
              .bg-image('images/discount_1');
            }
            &.guarantee {
              .bg-image('images/guarantee_1');
            }
            &.invoice {
              .bg-image('images/invoice_1');
            }
            &.special {
              .bg-image('images/special_1');
            }
          }
          .text {
            line-height: 12px;
            font-size: 10px;
          }
        }
      }
      .support-count {
        position: absolute;
        display: block;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        border-radius: 14px;
        background: rgba(0, 0, 0, 0.2);
        text-align: center;
        .count {
          vertical-align: top;
          font-size: 10px;
        }
        .icon-keyboard_arrow_right {
          margin-left: 2px;
          line-height: 24px;
          font-size: 10px;
        }
      }
    }
    .bulletin-wrapper {
      position: relative;
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      font-size: 10px;
      // 规定段落中的文本不换行
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(7, 17, 27, .2);
      // font-size: 0;
      .bulletin-title {
        display: inline-block;
        vertical-align: top;
        margin-top: 7px;
        width: 22px;
        height: 12px;
        .bg-image('images/bulletin');
        background-size: 22px 12px;
        background-repeat: no-repeat;
      }
      .bulletin-text {
        margin: 0 4px;
        font-size: 10px;
      }
      .icon-keyboard_arrow_right {
        position: absolute;
        font-size: 10px;
        right: 12px;
        top: 8px;
      }
    }
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      // height: 100%;
      z-index: -1;
      filter: blur(10px);
      img {
        margin-top: 30px;
        width: 100%;
      }
    }
    // 遮罩开始
    .detail {
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(7, 17, 27, .8);
      // filter: blur(10px);
      .detail-wrapper {
        min-height: 100%;
        overflow: hidden;
        .detail-main {
          margin-top: 64px;
          padding-bottom: 64px;
          .name {
            line-height: 32px;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          // 星星组件
          .star-wrapper {
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          // 优惠信息
          .title {
            display: flex;
            width: 80%;
            margin: 28px auto 24px auto;
            .line {
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, .2);
            }
            .text {
              padding: 0 12px;
              font-size: 14px;
              font-weight: 700;
            }
          }
          // 列表信息
          .supports {
            width: 80%;
            margin: 0 auto;
            .support-item {
              padding: 0 12px;
              margin-bottom: 12px;
              font-size: 0;
              &:last-child {
                margin-bottom: 0;
              }
              // 图标
              .icon {
                display: inline-block;
                width: 16px;
                height: 16px;
                vertical-align: top;
                margin-right: 6px;
                background-size: 16px 16px;
                background-repeat: no-repeat;
                &.decrease {
                  .bg-image('images/decrease_2');
                }
                &.discount {
                  .bg-image('images/discount_2');
                }
                &.guarantee {
                  .bg-image('images/guarantee_2');
                }
                &.invoice {
                  .bg-image('images/invoice_2');
                }
                &.special {
                  .bg-image('images/special_2');
                }
              }
              // 文字信息
              .text {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
          // 公告信息
          .bulletin {
            width: 80%;
            margin: 0 auto;
            .content  {
              margin: 0 12px;
              font-size: 12px;
              line-height: 24px;
              font-weight: 200;
            }
          }
        }
      }
      // 关闭按钮
      .detail-close {
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        clear: both;
        font-size: 32px;
      }
      // 关闭按钮
      .detailShow-bg {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(7, 17, 27, .8);
        filter: blur(10px);
        z-index: -1;
      }
    }
  }
</style>
