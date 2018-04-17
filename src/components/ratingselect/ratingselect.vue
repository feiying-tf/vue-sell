<template>
    <div class="ratingselect">
        <!-- 小方块 -->
        <div class="rating-type border-1px">
            <span @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">
                {{desc.all}}
                <span class="count">{{ratings.length}}</span>
            </span>
            <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">
                {{desc.positive}}
                <span class="count">{{positives.length}}</span>
            </span>
            <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">
                {{desc.negative}}
                <span class="count">{{negatives.length}}</span>
            </span>
        </div>
        <!-- 开关 -->
        <div @click.stop.prevent="toggleContent" class="switch" :class="{'on':onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    export default {
        props: {
            ratings: {
                type: Array,
                default () {
                    return [];
                }
            },
            selectType: {
                type: Number,
                default: ALL
            },
            onlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default () {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        methods: {
            select (type, event) {
                this.selectType = type;
                // 传回去的目的是为了在food组件里面写对应的评价列表
                this.$root.eventHub.$emit('ratingtype.select', type);
            },
            toggleContent () {
                console.log(this.onlyContent);
                this.onlyContent = !this.onlyContent;
                // 与上同理
                this.$root.eventHub.$emit('content.toggle', this.onlyContent);
            }
        },
        computed: {
            positives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE;
                });
            },
            negatives () {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE;
                });
            }
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../common/stylus/mixin.less";
    // @import "../../stylus/mixin.less";
    .ratingselect {
        // 三个小方块
        .rating-type {
            padding: 18px 0;
            margin: 0 18px;
            .border-1px(rgba(7, 17, 27, .1));
            .block {
                display: inline-block;
                padding: 8px 12px;
                border-radius: 1px;
                margin-right: 8px;
                color: rgb(77, 85, 93);
                font-size: 12px;
                &.active {
                    color: #fff;
                }
                .count {
                    font-size: 8px;
                    margin-right: 2px;
                    line-height: 16px;
                }
                &.positive {
                    background: rgba(0, 160, 220, .2);
                    &.active {
                        background: rgb(0, 160, 220);
                    }
                }
                &.negative {
                    background: rgba(77, 85, 93, .2);
                    &.active {
                        background: rgb(77, 85, 93);
                    }
                }

            }
        }
        // 开关
        .switch {
            padding: 12px 18px;
            line-height: 24px;
            border-bottom: 1px solid rgba(7, 17, 27, .1);
            color: rgb(147, 143, 159);
            font-size: 0;
            &.on {
                .icon-check_circle {
                    color: #00c850;
                }
            }
            .icon-check_circle {
                display: inline-block;
                vertical-align: top;
                margin-right: 4px;
                font-size: 24px;
            }
            .text {
                font-size: 12px;
                vertical-align: top;
            }
        }
    }
</style>
