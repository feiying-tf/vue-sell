<template>
<div>
  <div class="goods">
    <!-- 左侧菜单分类 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- :class="{'current':currentIndex===index} 如果函数currentIndex的返回值等于当前li标签的index，那么current这个类选择器就有效 -->
        <li v-for="(item, index) in goods" :key="item.id" class="menu-item"
         :class="{'current':currentIndex === index}" @click="selectMenu(index)">
          <span class="text border-1px">
          <span v-show="item.type>0" class="icon"
             :class = "classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 菜品具体内容 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.id" class="food-item border-1px"  @click="selectFood(food, $event)">
              <div class="icon">
                <img :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span class="count">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!-- 增加减少数量 -->
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
</div>
</template>
<script>
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import food from '../food/food.vue';

  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        // 获取一个对象，这个对象的data属性便是里面的内容
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // 在下次DOM更新循环结束之后执行延迟回调
          // 拿到数据以后，dom更新
            this.$nextTick(function () {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
      // 监听cart.add这个事件，接收到事件传过来的值
      // this.$root.eventHub.$on('cart.add', (target) => {
      //   this._drop(target);
      // });
    },

    methods: {
      // 左侧点击，事件驱动程序
      selectMenu (index) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        // el为dom元素，当前设置的foodsScroll会移动到当前位置，动画时间300s
        this.foodsScroll.scrollToElement(el, 300);
      },
      // 点击那个li标签，就将当前的food赋给selectedFood
      selectFood (food, event) {
        this.selectedFood = food;
        // 调用food里面的show方法，将food组件的显示标志位设置为true
        this.$refs.food.show();
      },
      _initScroll () {
        // 主要是比较当前wrapper的高度与里面内容ul的高度，如果内容比较大，那么就可以滚动；
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // 由于菜单栏应用了better-Scroll，所以要想使用点击事件，就必须在这里将点击事件激活
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // 相当于一个探针的效果,检测滚动的高度
          probeType: 3,
          click: true
        });
        // 监听滚动事件，pos便是滚动的高度
        this.foodsScroll.on('scroll', (pos) => {
          // 这样便拿到了右边菜品滚动的高度
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    components: {
        shopcart,
        cartcontrol,
        food
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/stylus/mixin.less";
  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    // 左边菜单
    .menu-wrapper {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current {
          position: relative;
          margin-top: -1px;
          z-index: 10;
          background-color: #fff;
          font-weight: 700;
          .text {
            .border-none();
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            .bg-image('images/decrease_3');
          }
          &.discount {
            .bg-image('images/discount_3');
          }
          &.guarantee {
            .bg-image('images/guarantee_3');
          }
          &.invoice {
            .bg-image('images/invoice_3');
          }
          &.special {
            .bg-image('images/special_3');
          }
        }
        .text {
          display: table-cell;
          // width: 56px;
          vertical-align: middle;
          font-size: 12px;
          .border-1px(rgba(7, 17, 27, .1));
        }
      }
    }
    // 菜品内容
    .foods-wrapper {
      flex: 1;
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7;
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        .border-1px(rgba(7, 17, 27, .1));
        &:last-child {
          .border-none();
          margin-bottom: 0;
        }
        .icon {
          flex: 0 0 57px;
          // width: 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .desc,
          .extra {
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .desc {
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra {
            line-height: 10px;
            // font-size: 0;
            .count {
              margin-left: 12px;
              // background: red;
            }
          }
          // 价格
          .price {
            font-weight: 700;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240, 20, 20);
            }
            .old {
              vertical-align: middle;
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }
          // 控制数量插件
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
            // background-color: red;
          }
        }
      }
    }
  }
</style>
