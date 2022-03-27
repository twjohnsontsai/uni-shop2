<template>
	 <view class="goods-item">
	    <!-- 商品左侧图片区域 -->
	    <view class="goods-item-left">
			<!-- 9.1.3 为 my-goods 组件封装 radio 勾选状态 -->
			<!-- 9.1.3.1打开 my-goods.vue 组件的源代码，为商品的左侧图片区域添加 radio 组件 -->
			<!-- 商品左侧图片区域 -->
			<!-- 使用 v-if 指令控制 radio 组件的按需展示：v-if="showRadio" -->
			<!-- 9.1.3.6修改 my-goods.vue 组件，动态为 radio 绑定选中状态：从Storage中修改state的布林值，再绑定checked与goods.state -->
			<!-- 9.1.4.2在 my-goods.vue 组件中，为 radio 组件绑定 @click 事件处理函数如下： -->
			 <radio :checked='goods.goods_state' color="#C00000" v-if="showRadio"  @click="radioClickHandler"></radio>
	      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
	    </view>
	    <!-- 商品右侧信息区域 -->
	    <view class="goods-item-right">
	      <!-- 商品标题 -->
	      <view class="goods-name">{{goods.goods_name}}</view>
	      <view class="goods-info-box">
	        <!-- 商品价格 -->
			<!-- 6.5.2在渲染商品价格的时候，通过管道符 | 调用过滤器： | tofixed -->
	        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
			<!-- 9.1.6 为 my-goods 组件封装 NumberBox （注意：NumberBox 组件是 uni-ui 提供的）-->
			<!-- 9.1.6.1修改 my-goods.vue 组件的源代码，在类名为 goods-info-box 的 view 组件内部渲染 NumberBox 组件的基本结构： -->
			<!-- 9.1.6.3在 my-goods.vue 组件中，动态为 NumberBox 组件绑定商品的数量值： -->
			<!--9.1.6.5 在 my-goods.vue 组件中，使用 v-if 指令控制 NumberBox 组件的按需展示 -->
			<!-- 9.1.7.2在 my-goods.vue 组件中，为 uni-number-box 组件绑定 @change="numberChangeHandler" 事件处理函数(cart.vue)如下： -->
			 <uni-number-box :min="1"  :value="goods.goods_count"  v-if="showNum" @change="numberChangeHandler"></uni-number-box>
	      </view>
	    </view>
	  </view>
</template>

<script>
	export default {
		// 封装商品组件goods～～声明一个props属性,指向一个对象{}
		props:{
			// 渲染的对象就是goods的对应属性,所以封装就以goods属性,指向page对象
			goods:{
				type:Object,
				// type指定数据类型
				default:{},
				// default指定默认值是一个"空对象”
			},
			// 9.1.3.3封装名称为 showRadio 的 props 属性，来控制当前组件中是否显示 radio 组件：
			// 是否展示图片左侧的 radio
			    showRadio: {
			      type: Boolean,
			      // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
			      default: false,
			    },
				// 9.1.6.4在 my-goods.vue 组件中，封装名称为 showNum 的 props 属性，来控制当前组件中是否显示 NumberBox 组件：
				  // 是否展示价格右侧的 NumberBox 组件
				     showNum: {
				       type: Boolean,
				       default: false,
				     },
		},
		name:"my-goods",
		data() {
			return {
			// 默认的图片
			defaultPic : 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'	
			};
		},
		// 9.1.4.3在 my-goods.vue 组件的 methods 节点中，定义 radioClickHandler 事件处理函数：
		methods:{
			 // radio 组件的点击事件处理函数
			radioClickHandler(){
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				    // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数,console log(e)就是goods_id,、goods.goods_state
				    this.$emit('radio-change', {
				      // 商品的 Id
				      goods_id: this.goods.goods_id,
				      // 商品最新的勾选状态（取反）
				      goods_state: !this.goods.goods_state
				    })
			},
			// 9.1.7.3.1在 my-goods.vue 组件的 methods 节点中，把监听到的NUmberBox的组件数量变化做 numChangeHandler 事件处理函数定义：( NumberBox 组件的 change 事件处理函数)
			numberChangeHandler(val){
				// console.log(val);//这里可以打印出数值的变化
				//  9.1.7.3.2通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
				    this.$emit('num-change', {
				      //  9.1.7.3..3商品的 Id
				      goods_id: this.goods.goods_id,
				      //  9.1.7.3..4商品的最新数量(需要确定为数值所以在val添加+号或是后面-0)
				      goods_count: +val,
					   // 9.1.7.3.5再到store/cart.js将数据存储到本地
				    })
			}
		},
		// 6.5 使用过滤器处理价格
		// 在 my-goods 组件中，和 data 节点平级，声明 filters 过滤器节点如下：
		// 使用过滤器处理商品，filters指向一个对象{ tofixed是个function函数( ){ } }接收一个数值num，然后调用一个Number(num) .tofixed(2)的方法保留2位数
		filters: {
			// 将商品的价格变成带2位小数点
			 tofixed(num) {
			    return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item{
		display: flex;
		padding: 5px 10px;
		border-bottom: 1px solid #F0F0F0;
		// 9.1.2.11.4美化 my-goods.vue 组件的样式：bag已经修正，以下两行代码可以不需要了
		// width: 750rpx; 
		// box-sizing: border-box;
		.goods-item-left{
			margin-right: 5px;
			// 9.1.3.2给类名为 goods-item-left 的 view 组件添加样式，实现 radio 组件和 image 组件的左右布局：
			display: flex;
			justify-content: space-between;
			align-items: center;
			.goods-pic{
				height: 100px;
				width: 100px;
				display: block;//防止图片下面有一定空白的间隙
			}
		}
		.goods-item-right{
			display: flex;//自动分布
			flex-direction: column;//纵向布局
			justify-content: space-between;//上下两端贴边
			.goods-name{
				font-size: 13px;
			}
			// 9.1.6.2美化页面的结构：
			.goods-info-box{
				display: flex;
				    align-items: center;
				    justify-content: space-between;
				  }
				.goods-price{
					color: #c00000;
					font-size: 16px;
				}
		}
	}
</style>
