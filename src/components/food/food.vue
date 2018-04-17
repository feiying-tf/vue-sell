<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <!-- 头部照片 -->
                <div class="image-header">
                    <!-- 头部图片 -->
                    <img :src="food.image">
                    <!-- 返回按钮 -->
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <!-- 内容部分 -->
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <!-- 控制数量 -->
                    <div class="cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <div @click="addFirst" class="buy" v-show="!food.count || food.count===0" >加入购物车</div>
                </div>
                <!-- 分割部分 -->
                <split v-show="food.info"></split>
                <!-- 商品介绍 -->
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <!-- 分割部分 -->
                <split></split>
                <!-- 商品评价 -->
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect :select-type="selectType"
                    :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
                </div>
                <!-- 评价具体内容 -->
                <div class="rating-wrapper">
                    <!-- 如果有ratings并且ratings的长度不为0，那么执行下面的程序 -->
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType, rating.text)"  v-for="rating in food.ratings" :key="rating.id" class="rating-item border-1px">
                            <!-- 用户信息 -->
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img :src="rating.avatar" class="avatar" width="12">
                            </div>
                            <!-- 时间 -->
                            <div class="time">{{rating.rateTime | formatDate_1}}</div>
                            <!-- 评价内容 -->
                            <p class="text">
                                <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>
                                {{rating.text}}
                            </p>
                        </li>
                    </ul>
                    <!-- 当完全没有ratings的时候，执行下面的程序 -->
                    <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import {formatDate} from '../../common/js/date.js';
    // const POSITIVE = 0;
    // const NEGATIVE = 1;
    const ALL = 2;
    export default {
        props: {
            food: {
                type: Object
            }
        },
        data () {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            };
        },
        filters: {
            formatDate_1 (time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        methods: {
            show () {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick(() => {
                    if (!this.srcoll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hide () {
                this.showFlag = false;
            },
            addFirst (event) {
                Vue.set(this.food, 'count', 1);
                this.$root.eventHub.$emit('cart.add', event.target);
            },
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
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        created () {
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
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
@import "../../common/stylus/mixin.less";
    .food {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #fff;
        &.move-enter-active, &.move-leave-active {
            transition: all .4s linear;
        }
        &.move-enter, &.move-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        // 头部图片
        .image-header {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            // 返回按钮
            .back {
                position: absolute;
                top: 10px;
                left: 10px;
                border-radius: 50%;
                background: rgba(7, 17, 27, .4);
                .icon-arrow_lift {
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: rgba(255, 255, 255, .9);
                }
            }
        }
        .content {
            position: relative;
            padding: 18px;
            .title {
                line-height: 14px;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            }
            .detail {
                margin-bottom: 18px;
                line-height: 10px;
                font-size: 0;
                height: 10px;
                .sell-count, .rating {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .sell-count {
                    margin-right: 12px;
                }
            }
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
            .cartcontrol-wrapper {
                position: absolute;
                right: 12px;
                bottom: 12px;
            }
            .buy {
                position: absolute;
                right: 18px;
                bottom: 18px;
                z-index: 10;
                height: 24px;
                line-height: 24px;
                padding: 0 12px;
                box-sizing: border-box;
                border-radius: 12px;
                font-size: 10px;
                color: #fff;
                background: rgb(0, 160, 220);
            }
        }
        // 商品介绍
        .info {
            padding: 18px;
            .title {
                line-height: 14px;
                margin-bottom: 6px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .text {
                line-height: 24px;
                padding: 0 8px;
                font-size: 12px;
                color: rgb(77, 85, 93)
            }
        }
        // 商品评价
        .rating {
            padding-top: 18px;
            .title {
                line-height: 14px;
                margin-left: 18px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
        }
        // 评价具体内容
        .rating-wrapper {
            padding: 0 18px;
            // 有评价时
            .rating-item {
                position: relative;
                padding: 16px 0;
                .border-1px(rgba(7, 17, 27, .1));
                // 用户信息
                .user {
                    position: absolute;
                    right: 0;
                    top: 16px;
                    line-height: 12px;
                    font-size: 0;
                    .name {
                        display: inline-block;
                        margin-right: 6px;
                        vertical-align: top;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .avatar {
                        border-radius: 50%;
                    }
                }
                .time {
                    margin-bottom: 6px;
                    line-height: 12px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .text {
                    line-height: 16px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                    .icon-thumb_up, .icon-thumb_down {
                        margin-right: 4px;
                        line-height: 16PX;
                        font-size: 12px;
                    }
                    .icon-thumb_up {
                        color: rgb(0, 160, 220);
                    }
                    .icon-thumb_down {
                        color: rgb(147, 153, 159);
                    }
                }
            }
            //无评价时
            .no-rating {
                padding: 16px 0;
                font-size: 12px;
                color: rgb(147, 153, 159);
            }
        }
    }
</style>
