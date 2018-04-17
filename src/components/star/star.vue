<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :key = "itemClass.id"  :class="itemClass" class="star-item"></span>
    <span>11111</span>
  </div>
</template>
<script>
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';
  export default {
      props: {
          // 尺寸
          size: {
              type: Number
          },
          // 分数
          score: {
              type: Number
          }
      },
      computed: {
          starType () {
              return 'star-' + this.size;
          },
          // 通过分数的判断,将星星的状态放到数组里面
          itemClasses () {
              let result = [];
              // 以0.5为分界线的计算
              let score = Math.floor(this.score * 2) / 2;
              // 是否有半星
              let hsaDecimal = score % 1 !== 0;
              // 全星的个数
              let integer = Math.floor(score);
              for (let i = 0; i < integer; i++) {
                  result.push(CLS_ON);
              }
              // 如果有半星，放到数组里面
              if (hsaDecimal) {
                  result.push(CLS_HALF);
              }
              // 进行补全
              while (result.length < LENGTH) {
                  result.push(CLS_OFF);
              }
              return result;
          }
      }
  };
</script>
<style lang="less" rel="stylesheet/less">
 @import "../../common/stylus/mixin.less";
    .star {
        font-size: 0;
        // height: 20px;
        .star-item {
            display: inline-block;
            background-repeat: no-repeat;
        }
        &.star-48 {
            .star-item {
                width: 20px;
                height: 20px;
                margin-right: 22px;
                background-size: 20px 20px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    .bg-image('images/star48_on');
                }
                &.half {
                    .bg-image('images/star48_half');
                }
                &.off {
                    .bg-image('images/star48_off');
                }
            }
        }
        &.star-36 {
            .star-item {
                width: 15px;
                height: 15px;
                margin-right: 6px;
                background-size: 15px 15px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    .bg-image('images/star36_on');
                }
                &.half {
                    .bg-image('images/star36_half');
                }
                &.off {
                    .bg-image('images/star36_off');
                }
            }
        }
        &.star-24 {
            .star-item {
                width: 10px;
                height: 10px;
                margin-right: 3px;
                background-size: 10px 10px;
                &:last-child {
                    margin-right: 0;
                }
                &.on {
                    .bg-image('images/star24_on');
                }
                &.half {
                    .bg-image('images/star24_half');
                }
                &.off {
                    .bg-image('images/star24_off');
                }
            }
        }
    }
</style>
