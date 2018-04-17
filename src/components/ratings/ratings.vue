<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <!-- 分数介绍 -->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!-- 评星 -->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size='36' :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size='36' :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <!-- 配送时间 -->
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" :key="rating.id" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" :key="item.id">{{item}}</span>
              </div>
              <div class="time">
                <!-- 计算时间 -->
                {{rating.rateTime | formatDate_1}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/js/date.js';
  const ALL = 2;
  const ERR_OK = 0;
  export default {
      props: {
        seller: {
          type: Object
        }
      },
      data () {
        return {
          ratings: [],
          selectType: ALL,
          onlyContent: true
        };
      },
      created () {
        // 通过请求，得到后端的数据（ratings）
        this.$http.get('/api/ratings').then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.ratings = response.data;
            this.$nextTick(function () {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              });
            });
          }
        });
        this.$root.eventHub.$on('ratingtype.select', (type) => {
            this.selectType = type;
            // 每次传过来值以后就让屏幕重新refresh一下,这样就能让屏幕往上拨了以后回弹到正确的位置
            this.$nextTick(function () {
                this.scroll.refresh();
            });
        });
        this.$root.eventHub.$on('content.toggle', (content) => {
            this.onlyContent = content;
            // 每次传过来值以后就让屏幕重新refresh一下
            this.$nextTick(function () {
                this.scroll.refresh();
            });
        });
      },
      methods: {
        needShow (type, text) {
            // 如果选择只显示内容，而且没有文本的话，直接将当前评论隐藏
            if (this.onlyContent && !text) {
                return false;
            }
            if (this.selectType === ALL) {
                return true;
            } else {
                return type === this.selectType;
            }
        }
      },
      filters: {
            formatDate_1 (time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
      },
      components: {
        star,
        ratingselect,
        split
      }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/mixin.less";
  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    // bottom: 48px;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;
      // 评分
      .overview-left {
        padding: 6px 0;
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7, 17, 27, .1);
        text-align: center;
        // 为了预防屏幕较小时发生的分行现象
        @media only screen and (max-width: 320px) {
          flex: 0 0 100px;
          width: 100px;
        }
        .score {
          margin-bottom: 6px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255, 153, 0);
        }
        .title {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
        .rank {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
      // 评星
      .overview-right {
        flex: 1;
        padding: 6px 0  6px 24px;
        @media only screen and (max-width: 320px) {
          flex: 1;
          padding-left: 6px;
        }
        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;
          .title {
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
          .star {
            display: inline-block;
            margin: 0 12px;
            vertical-align: top;
          }
          .score {
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            font-size: 12px;
            color: rgb(255, 153, 0);
          }
        }
        // 配送时间
        .delivery-wrapper {
          font-size: 0;
          .title {
            line-height: 18px;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
          .delivery {
            margin-left: 12px;
            font-size: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        display: flex;
        padding: 18px 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        .avatar {
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img {
            border-radius: 50%;
          }
        }
        .content {
          position: relative;
          flex: 1;
          .name {
            margin-bottom: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7, 17, 27);
          }
          .star-wrapper {
            margin-bottom: 6px;
            font-size: 0;
            .star {
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
            }
            .delivery {
              display: inline-block;
              vertical-align: top;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          .text {
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7, 17, 27);
            font-size: 12px;
          }
          .recommend {
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .item {
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
            .item {
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
              background: #fff;
            }
          }
          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
</style>
