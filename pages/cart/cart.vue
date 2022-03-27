<template >
	<!-- 9.3.1.3在 cart.vue 页面中使用自定义的 my-settle 组件，并美化页面样式，防止页面底部被覆盖： -->
	<view class="cart-container" v-if="cart.length!==0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 9.1 商品列表区域 -->
		<!-- 9.1.1 渲染购物车商品列表的标题区域 -->
		<!-- 9.1.1.1定义如下的 UI 结构： -->
		<!--9.1.1.1.1 购物车商品列表的标题区域 -->
		<view class="cart-title">
		  <!-- 左侧的图标 -->
		  <uni-icons type="shop" size="18"></uni-icons>
		  <!-- 9.1.1.1.2描述文本 -->
		  <text class="cart-title-text">购物车</text>
		</view>
		<!-- 9.1.11 渲染滑动删除的 UI 效果 (滑动删除需要用到 uni-ui 的 uni-swipe-action 组件和 uni-swipe-action-item。详细的官方文档请参考SwipeAction 滑动操作。)-->
		<!-- 9.1.11.1改造 cart.vue 页面的 UI 结构，将商品列表区域的结构修改如下（可以使用 uSwipeAction 代码块快速生成基本的 UI 结构）： -->
		<!-- 9.1.11.1.1商品列表区域（加上后，购物车的徽标bag就正常了 -->
		<!-- uni-swipe-action 是最外层包裹性质的容器 -->
		<uni-swipe-action>
		<!-- 9.1.2.2在 UI 结构中，通过 v-for 指令循环渲染自定义的 my-goods 组件： -->
		<!-- 商品列表区域 -->
		<block v-for="(goods, i) in cart" :key="i">
			<!-- 每一次循环时，都可以创建一个商品的item项目 -->
			<!-- 9.1.3.5在 cart.vue 页面中的商品列表区域，指定 :show-radio="true" 属性，从而显示 radio 组件： -->
			<!-- 注意prpos的showRadio -->
			<!-- 9.1.4 为 my-goods 组件封装 radio-change 事件 -->
			<!-- 9.1.4.1.1当用户点击 radio 组件，希望修改当前商品的勾选状态，此时用户可以为 my-goods 组件绑定 @radio-change 事件，从而获取当前商品的 goods_id 和 goods_state： -->
			 <!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id 和 goods_state -->
			 <!-- 9.1.6.6在 cart.vue 页面中的商品列表区域，指定 :show-num="true" 属性，从而显示 NumberBox 组件： -->
			 <!-- 9.1.7 为 my-goods 组件封装 num-change 事件 -->
			 <!-- 9.1.7.1.1当用户修改了 NumberBox 的值以后，希望将最新的商品数量更新到购物车中，此时用户可以为 my-goods 组件绑定 @num-change 事件，从而获取当前商品的 goods_id 和 goods_count： -->
			  <!--9.1.11.1.2 uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 right(orleft)-options 属性来指定操作按钮的配置信息-->
			 <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
			<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
			</uni-swipe-action-item>
		  <!-- 在components有创建一个商品列项目，逐行显示商品列 P127-->
		</block>
		</uni-swipe-action>
		<!-- 9.3.1使用自定义的组件 -->
		<!-- 9.3.1.3.1结算区域 -->
		<my-settle></my-settle>
	</view>
	<!-- 9.3.8 渲染购物车为空时的页面结构 -->
	<!-- 9.3.8.1将 资料 目录中的 cart_empty@2x.png 图片复制到项目的 /static/ 目录中 -->
	<!-- 9.3.8.2改造 cart.vue 页面的 UI 结构，使用 v-if 和 v-else 控制购物车区域和空白购物车区域的按需展示： -->
	<!-- 空白购物车的区域 -->
	<view class="empty-cart" v-else>
		<image src="../../static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也</text>
	</view>
</template>

<script>
	// 8.8 动态为 tabBar 页面设置数字徽标(需求描述：从商品详情页面导航到购物车页面之后，需要为 tabBar 中的购物车动态设置数字徽标。)
	// 8.8.1把 Store 中的 total 映射到 cart.vue 中使用：
	// 封装到'@/mixins/tabbar-badge.js'
	
	// 8.9.2修改 home.vue，cate.vue，cart.vue，my.vue 这 4 个 tabBar 页面的源代码，分别导入 @/mixins/tabbar-badge.js 模块并进行使用：
    // 8.9.2.1导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	// 9.1.2 渲染商品列表区域的基本结构
	// 9.1.2.1按需导入 mapState 这个辅助函数
	// 9.1.5.2.1在 cart.vue 页面中，导入 mapMutations 这个辅助函数，从而将需要的 mutations 方法映射到当前页面中使用：
	import { mapState ,mapMutations} from 'vuex'

	export default {
		// 8.9.2.2将 badgeMix 混入到当前的页面中进行使用
		  mixins: [badgeMix],
		   computed: {
		      // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
		      ...mapState('m_cart', ['cart']), 
		    },
		data() {
			return {
			// 9.1.11.2在 data 节点中声明 options 数组，用来定义操作按钮的配置信息	
			options:[{
				text:'删除', // 显示的文本内容
				style:{
					backgroundColor:' #C00000' // 按钮的背景颜色
				}
			}]
			};
		}, 
		// 9.1.4.1.2定义 radioChangeHandler 事件处理函数如下：
		methods:{
			// 9.1.5.2.2在 cart.vue 页面中，导入 mapMutations 这个辅助函数，从而将需要的 mutations 方法映射到当前页面中使用
			// 9.1.10.2.1在 cart.vue 页面中，通过 mapMutations 这个辅助函数，将需要的 mutations 方法映射到当前页面中使用：
			// 9.1.12.2在 cart.vue 页面中，使用 mapMutations 辅助函数，把需要的方法映射到当前页面中使用
			...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount','removeGoodsById']),
			// 商品的勾选状态发生了变化
			    radioChangeHandler(e) {
					// console.log(e);
					// 输出得到的数据 -> {goods_id: 395, goods_state: false}
					// 当@radio-change还没有被设置应用时,console.log(e);是不会有反应的,需要到my-goods设置好@click才能驱动
			      this.updateGoodsState(e)
			    },
				// 9.1.7.1.2定义 numberChangeHandler 事件处理函数如下,然后转到my-goods去监听numberChangeHandler 的事件处理函数
				 // 9.1.10.2.2商品的数量发生了变化
				numberChangeHandler(e){
					this.updateGoodsCount(e)
					// console.log(e);
				},
				// 9.1.11.3在 methods 中声明 uni-swipe-action-item 组件的 @click 事件处理函数：
				//9.1.11.3.1 点击了滑动操作按钮，然后转到store/cart.js
				
				swipeActionClickHandler(goods){
					// console.log(goods);
					this.removeGoodsById(goods.goods_id)
				},
			  },	
	}
</script>

<style lang="scss">
.cart-container{
	padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  // flex-direction: column;居中重叠
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
} 
.empty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 150px;
	.empty-img{
		height: 90px;
		width: 90px;
	}
	.tip-text{
		font-size: 12px;
		    color: gray;
		    margin-top: 15px;
	}
}
</style>
