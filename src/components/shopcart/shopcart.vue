<template>
<!-- 由于vue2.0不支持template下挂载多个根元素，所以在此创建div将shopcart和mask包裹进来 -->
<div>
    <div class="shopcart">
      <!-- 内容区域 -->
      <div class="content" @click="toggleList">
          <div class="content-left">
              <div class="logo-wrapper">
                  <div class="logo" :class="{'highLight':totalCount>0}">
                      <i class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></i>
                  </div>
                  <!-- 数量标记 -->
                  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highLight':totalCount>0}">￥{{totalPrice}}元</div>
              <div class="desc">
                      另需配送费￥{{deliveryPrice}}元
                </div>
          </div>
          <div class="content-right" @click.stop.prevent="pay">
              <div class="pay" :class="{'enough':totalPrice >= minPrice}">
                  {{payDesc}}
              </div>
          </div>
      </div>
      <!-- 控制抛物线的小球 -->
      <div class="ball-container">
          <transition-group name="drop"  @before-enter="beforeEnter"
          @enter="enter" @after-enter="afterEnter">
          <!-- 生成5个小球 -->
            <div v-for="(ball, index) in balls" :key="index" v-show = "ball.show" class = "ball">
                <div class="inner inner-hook" key="b"></div>
            </div>
          </transition-group>
      </div>
      <!-- 购物车列表区 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
                <h1 class="title">购物车</h1>
                <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
                <ul>
                    <li class="food" v-for="food in selectFoods" :key="food.id">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartcontrol :food="food"></cartcontrol>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </transition>
  </div>
    <!-- 背景遮罩 -->
    <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
</div>
</template>
<script>
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import BScroll from 'better-scroll';
    export default {
        props: {
            //   接收配送费
            deliveryPrice: {
                type: Number,
                default: 0
            },
            //   最低起送价
            minPrice: {
                type: Number,
                default: 0
            },
            // 被选中的食物
            selectFoods: {
                type: Array,
                default () {
                    return [];
                }
            }
        },
      data () {
          return {
              // 是否折叠
                fold: true,
              // 一共5个小球
                balls: [
                    {
                    show: false
                    },
                    {
                    show: false
                    },
                    {
                    show: false
                    },
                    {
                    show: false
                    },
                    {
                    show: false
                    }
                ],
                dropBalls: []
          };
      },
      components: {
          cartcontrol
      },
      computed: {
        //   总共的价格
          totalPrice () {
              let total = 0;
              this.selectFoods.forEach((food) => {
                  total += food.price * food.count;
              });
              return total;
          },
        //   总共的数量
          totalCount () {
              let count = 0;
              this.selectFoods.forEach((food) => {
                  count += food.count;
              });
              return count;
          },
          // 计算起送部分的状态
          payDesc () {
            if (this.totalPrice === 0) {
                return `￥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice) {
                return `还差￥${this.minPrice - this.totalPrice}元起送`;
            } else {
                return '去结算';
            }
          },
          listShow () {
              // 如果总数量为0，那么设置fold为ture，然后进行返回
              if (!this.totalCount) {
                  // eslint-disable-next-line
                  this.fold = true;
                  return false;
              }
              // 如果总数量大于0， 那么设置fold为相反的状态
              let show = !this.fold;
              // 通过better-scroll加入滚动
              // 如果show为true，并且dom更新循环之后初始化scroll
              if (show) {
                  this.$nextTick(() => {
                      if (!this.scroll) {
                          // eslint-disable-next-line
                            this.scroll = new BScroll(this.$refs.listContent, {
                                 click: true
                            });
                      } else {
                          // 强制betterScroll强制计算，
                          // 当better-scroll中耳朵元素发生变化的时候调用此方法
                          this.scroll.refresh();
                      }
                  });
              }
              return show;
          }
      },
      created () {
          // 接收事件
        this.$root.eventHub.$on('cart.add', (target) => {
            this.drop(target);
        });
      },
      methods: {
            // 这个drop方法会被调用
            // 每点击一下，这个方法就会被调用，将第一个ball的show属性设置为true
            // 然后增加一个el属性，这个属性是点击的当前dom
            // 此时第一个小球显示，激活动画
            drop (el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        // 为了放到后面的动画中获取坐标使用；
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            toggleList () {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            // 隐藏遮罩
            hideList () {
                this.fold = true;
            },
            // 清除购物车
            empty () {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
            },
            // 结算价格
            pay () {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                if (window.confirm(`支付${this.totalPrice}元`)) {
                    this.empty();
                } else {

                }
            },
            // 设置过渡进入之前的组件状态
            // 这儿的el指的是移动的小球，而ball.el是点击的加号
            beforeEnter (el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    // 如果show为true，那么这个小球就是要运动的小球
                    if (ball.show) {
                        // 获取当前小球相对于视口的位置，el是当前点击对象dom节点
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        // window.innerHeighr 浏览器窗口的视口高度
                        let y = -(window.innerHeight - rect.top - 22);
                        // 控制小球的纵向的位移
                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        // 获取到里层的inner标签，控制小球横向的位移
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
                },
            // 设置过渡进入完成之后的组件状态
            enter (el) {
                // vue规定如果一些定义了，但是没有使用就会报错，这个注释可以解决掉这个问题
                //  定义这个变量是为了触发浏览器的重绘，重绘以后才会有效果
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0, 0, 0)';
                el.style.transform = 'translate3d(0, 0, 0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                inner.style.transform = 'translate3d(0,0,0)';
                });
            },
            // 设置过渡离开之前的组件状态
            afterEnter (el) {
                // drapBalls的作用就是在动画完成以后取出并且
                // 设置对应的show属性为false，达到隐藏的目的；
                //   console.log(el);
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            }
      }
  };
</script>

<style lang="less" rel="stylesheet/less">
 @import "../../common/stylus/mixin.less";
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        height: 48px;
        // background: #000;
        // 内容部分
        .content {
            display: flex;
            background-color: #141d27;
            font-size: 0;
            .content-left {
                flex: 1;
                // 购物车处的大圆
                .logo-wrapper {
                    display: inline-block;
                    position: relative;
                    top: -10px;
                    margin: 0 12px;
                    padding: 6px;
                    width: 56px;
                    height: 56px;
                    box-sizing: border-box;
                    vertical-align: top;
                    border-radius: 50%;
                    background-color: #141d27;
                    // 购物车处的小圆
                    .logo {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        text-align: center;
                        background: #2b343c;
                        &.highLight {
                            background: rgb(0, 160, 220);
                        }
                        // 购物车
                        .icon-shopping_cart {
                            line-height: 44px;
                            font-size: 24px;
                            color: #80858a;
                            &.highLight {
                                color: #fff;
                            }
                        }
                    }
                    // 数量标记
                    .num {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 24px;
                        height: 16px;
                        line-height: 16px;
                        text-align: center;
                        border-radius: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        color: #fff;
                        background: rgb(240, 20, 20);
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                    }
                }
                // 价格
                .price {
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 12px;
                    line-height: 24px;
                    padding-right: 12px;
                    box-sizing: border-box;
                    border-right: 1px solid rgba(255, 255, 255, .1);
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, .4);
                    &.highLight {
                        color: #fff;
                    }
                }
                // 描述
                .desc {
                    display: inline-block;
                    vertical-align: top;
                    margin: 12px 0 0 12px;
                    line-height: 24px;
                    letter-spacing: 0.05em;
                    color: rgba(255, 255, 255, .4);
                    font-size: 10px;
                }
            }
            .content-right {
                flex: 0 0 105px;
                width: 105px;
                background: #2b333b;
                .pay {
                    height: 48px;
                    line-height: 48px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, .4);
                    &.enough {
                        background-color: #00b43c;
                        color: rgb(255, 255, 255);
                    }
                }
            }
        }
        // 动画球部分
        .ball-container {
            .ball {
                position: fixed;
                left: 32px;
                bottom: 22px;
                z-index: 200;
                .inner {
                        height: 16px;
                        width: 16px;
                        border-radius: 50%;
                        background: rgb(0, 160, 220);
                }
                &.drop-enter-active {
                    transition: all 0.2s cubic-bezier(0.49, -0.29, 0.75, 0.41);
                    .inner {
                        transition: all 0.2s linear;
                    }
                }
            }
        }
        // 购物车列表部分
        .shopcart-list {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            // 让购物车列表部分向上移动自身的100%，作为起始坐标；
            transform: translate3d(0, -100%, 0);
            &.fold-enter-active, &.fold-leave-active {
                transition: all .2s linear;
            }
            // // 动画的开始和离开状态
            &.fold-enter, &.fold-leave-to {
                // opacity: 0;
                transform: translate3d(0, 0, 0);
            }
            // 头部
            .list-header {
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, .1);
                .title {
                    float: left;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .empty {
                    float: right;
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                }
            }
            // 内容部分
            .list-content {
                padding: 0 18px;
                max-height: 217px;
                overflow: hidden;
                background: #fff;
                .food {
                    position: relative;
                    padding: 12px 0;
                    box-sizing: border-box;
                    .border-1px(rgba(7, 17, 27, .1));
                    .name {
                        line-height: 24px;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .price {
                        position: absolute;
                        right: 90px;
                        bottom: 12px;
                        line-height: 24px;
                        font-size: 14px;
                        font-weight: 700;
                        color: rgb(240, 20, 20);
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 6px;
                    }
                }
            }
        }

    }
    .list-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 40;
        filter: blur(10px);
        opacity: 1;
        background: rgba(7, 17, 27, .7);
        &.fade-enter-active, &.fade-leave-active {
            transition: all .2s linear;
        }
        // // 动画的开始和离开状态
        &.fade-enter, &.fade-leave-to {
            opacity: 0;
            background: rgba(7, 17, 27, 0);
            // transform: translate3d(0, 0, 0);
        }
    }
</style>
