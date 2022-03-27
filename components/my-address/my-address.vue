<template>
	<!-- 9.2 收货地址区域 -->
	<!-- 9.2.1 创建收货地址组件 -->
	<!-- 9.2.1.1在 components 目录上鼠标右键，选择 新建组件my-address，并填写组件相关的信息： -->
	<view>
		<!-- 9.2.2渲染收货地址组件的基本结构： -->
		 <!-- 9.2.2.1选择收货地址的盒子 -->
		 <!-- 9.2.2.2.1使用 v-if 实现按需展示： -->
		 <view class="address-choose-box" v-if="JSON.stringify(address) ==='{}'">
			 <!-- 9.2.3 实现选择收货地址的功能 -->
			 
			 <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		 </view>
		 <!-- 9.2.2.2渲染收货信息的盒子 -->
		  <!-- 9.2.2.2.2使用 v-else 实现按需展示： -->
		  <!-- 9.2.7 重新选择收货地址 -->
		  <!--9.2.7.1 为 class 类名为 address-info-box 的盒子绑定 click 事件处理函数如下： -->
		 <view class="address-info-box" v-else @click="chooseAddress">
		     <view class="row1">
		       <view class="row1-left">
				   <!-- 9.2.3.4渲染收货地址区域的数据： -->
				   <!-- 9.2.3.4.1渲染收货信息的盒子收货人：<text>{{address.userName}}</text>..... -->
		         <view class="username">收货人：<text>{{address.userName}}</text></view>
		       </view>
		       <view class="row1-right">
		         <view class="phone">电话：<text>{{address.telNumber}}</text></view>
		         <uni-icons type="arrowright" size="16"></uni-icons>
		       </view>
		     </view>
		     <view class="row2">
		       <view class="row2-left">收货地址：</view>
		       <view class="row2-right">{{addstr}} </view>
		     </view>
		   </view>
		  <!-- 9.2.1.3.1底部的边框线 -->
		<image src="../../static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	// 9.2.4.3改造 address.vue 组件中的代码，使用 vuex 提供的 address 计算属性 替代 data 中定义的本地 address 对象
	// 9.2.4.3.1. 按需导入 mapState 和 mapMutations 这两个辅助函数
	// 9.2.6.2.1改造 my-address.vue 组件中的代码，通过 mapGetters 辅助函数，将 m_user 模块中的 addstr 映射到当前组件中使用：
	import { mapState, mapMutations, mapGetters } from 'vuex'

	export default {
		name:"my-address",
		data() {
			return {
				// 9.2.2 实现收货地址区域的按需展示
				//9.2.2.1 在 data 中定义收货地址的信息对象：
				  // 9.2.2.1.1收货地址(先设置address为空)
				  // 9.2.4.3..2.1 注释掉下面的 address 对象，使用 9.2.4.3.2.2 中的代码替代之(使用vuex的address数据)
				// address:{}
					// 9.2.2.2.3植入username:'zs'就会显示收件人详细资料 ,zhuy8注意人名是字符串
					// username:"zs"
				}
		},
		// 9.2.3.2定义 chooseAddress 事件处理函数，调用小程序提供的 chooseAddress() API 实现选择收货地址的功能
		methods:{
			// 9.2.4.3.3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
			    ...mapMutations('m_user', ['updateAddress']),
			async chooseAddress(){
				// 9.2.3.2.1. 调用小程序提供的 API chooseAddress() 方法，即可使用选择收货地址的功能
				    //    返回值是一个数组【】：第 1 项为错误对象err；第 2 项succ为成功之后的收货地址对象
				const [err,succ]= await uni.chooseAddress().catch(err => err)
				// console.log(res)
				// 9.2.3.2.2. 当err等于null，而且succ.errMsg(clg给的值)用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok'){
				// 9.2.3.2.3为 data 里面的address收货地址对象赋值
				  // 9.2.4.3.3.2 把下面这行代码注释掉，使用 3.3 中的代码替代之
				// this.address = succ
				 // 9.2.4.3.3.3 调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面(vuex)
				       this.updateAddress(succ)
						}
			},
		},
		// 9.2.3.3.1定义收货详细地址的计算属性
		computed:{
			    //9.2.4.3. 2.2 把 m_user 模块中的 address 对象映射当前组件中使用，用vuex的address代替 data 中 address 对象
			    ...mapState('m_user', ['address']),
			 // 9.2.3.3.2收货详细地址的计算属性
			 // 9.2.6 将 addstr 抽离为 getters～～目的：为了提高代码的复用性，可以把收货的详细地址抽离为 getters，方便在多个页面和组件
			 // 之间实现复用。 剪切 my-address.vue 组件中的 addstr 计算属性的代码，粘贴到 user.js 模块中，作为一个 getters 节点：
			// addstr(){
			// 	// 9.2.3.3.3判断省市的字符串是否为空!this.address.provinceName,则返回空字符串
			// 	if (!this.address.provinceName) return ''
			// 	 // 9.2.3.3.4拼接 省，市，区，详细地址 的字符串并返回给用户
			// 	return this.address.provinceName+this.address.cityName + this.address.countyName + this.address.detailInfo
			// },
			// 9.2.6.2.2将 m_user 模块中的 addstr 映射到当前组件中使用
			    ...mapGetters('m_user', ['addstr']),
		},
	}
</script>

<style lang="scss">
	// 9.2.1.3.1底部边框线的样式
.address-border{
	display: block;//转成块元素
	width: 100%;
	height: 5px;
}
// 9.2.1.3.2选择收货地址的盒子
.address-choose-box{
	height: 90px;
	  display: flex;//横向和纵向都是剧中的
	  align-items: center;
	  justify-content: center;
}
.btnChooseAddress{
	
}
// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;//纵向伸缩布局
  justify-content: center;//两行纵向上居中对齐
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;//不自动换行
    }
  }
}
</style>
