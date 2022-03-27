<template>
	<!-- 9.3 结算区域 -->
	<!-- 9.3.1 把结算区域封装为组件 -->
	<!-- 9.3.1.1在 components 目录中，新建 my-settle 结算组件： -->
	<!-- 9.3.1.2初始化 my-settle 组件的基本结构和样式 -->
	<!-- 9.3.1.2.1最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选 （从代码片段就可以取得下面的结构）-->
		<!-- 9.3.5.3为 UI 中的 label 组件绑定 click 事件处理函数： -->
		<label class="radio" @click="changeAllState">
			<!-- 9.3.4.2为 radio 组件“动态绑定” “：” checked 属性的值，因为isFullCheck返回值是true或是false所以，直接引用match tech设置就可以了： -->
			<radio color="#C00000" :checked=  "isFullCheck" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<!-- 9.3.6.3在组件的 UI 结构中，渲染已勾选的商品的总价： -->
		<view class="amount-box">合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<!-- 9.3.3.3将 checkedCount 的值渲染到页面中： -->
		<view class="btn-settle">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	// 9.3.3.2在 my-settle 组件中，将mapGetters 辅助函数，将需要的 getters 映射到当前组件中使用：
	// 按需从veux导入辅助函数叫mapGetters
	// 9.3.5.2通过mapMutations辅助函数,把需要的mutations方法映射到当前组件中使用
	// 9.3.5.2.1. 按需导入 mapMutations 辅助函数
	import { mapGetters ,mapMutations} from 'vuex'
	
	export default {
		name:"my-settle",
		data() {
			return {
			};
		},
		// 9.3.3.2.1声明一个计算属性
		computed: {
			// 9.3.3.2.2调用mapGetters的辅助函数,调用期间指定一个模块的名字,叫'm_cart'就是购物册模块,从购物车模块里按需导出'checkedCount'
			// 9.3.3.2.3这时候就可以在页面上的结算按钮上去使用（渲染）他了
			// 9.3.4 动态渲染全选按钮的选中状态
			// 9.3.4.1使用 mapGetters 辅助函数，将商品的总数量映射到当前组件中使用，并定义一个叫做 isFullCheck 的计算属性：
			//9.3.4 1.1 将 total 映射到当前组件中
			// 9.3.6.2在 my-settle 组件中，使用 mapGetters 辅助函数，把需要的 checkedGoodsAmount 映射到当前组件中使用：
		    ...mapGetters('m_cart', ['checkedCount','total','checkedGoodsAmount']),
			// 9.3.4.1.2定义一个新的计算属性, isFullCheck,透过和checkedCount','total'的比较求得boiling值，来改变checked的形态，true是打勾
			isFullCheck(){
				// 9.3.4.1.3. 判定是否全选
				return this.total === this.checkedCount
			},
		  },
		  methods:{
			  // 9.3.5.2通过mapMutations辅助函数,把需要的mutations方法映射到当前组件中使用
			  //9.3.5.2. 2. 使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
			 ...mapMutations('m_cart', ['updateAllGoodsState']),
			  // 9.3.5.4在 my-settle 组件的 methods 节点中，声明 changeAllState 事件处理函数
			  //9.3.5.4.1 label 的点击事件处理函数
			  changeAllState(){
				// 9.3.5.4.2修改购物车中所有商品的选中状态  
				 // 9.3.5.4.3  !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
				 // 9.3.5.4.4这个按钮值就是反当前页的isFullCheck值(bolling)true or false
				  this.updateAllGoodsState(!this.isFullCheck)
			  }
		  }
	}
</script>

<style lang="scss">
.my-settle-container {
	/* 底部固定定位 */
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  /* 设置宽高和背景色 */
	  width: 100%;
	  height: 50px;
	  background-color: white;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding-left: 5px;
	  font-size: 14px;
	  .radio{
		  display: flex;
		  align-items: center;
	  }
	  .amount-box{
		  .amount{
			  font-weight: bold;
			  color: #C00000;
		  }
	  }
		
	  .btn-settle{
		  background-color: #C00000;
		  color: white;
		  height: 50px;
		  line-height: 50px;//文字就在纵向上居中
		  padding: 0 10px;//上下距离是0，左右是10px
		  min-width: 100px;//增加宽度
		  text-align: center;//让文字居中
	  }
}
</style>
