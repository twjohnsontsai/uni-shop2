<template>
	<!-- 7.3.5 解决商品价格闪烁的问题 -->
<!-- 1.导致问题的原因：在商品详情数据请求回来之前，data 中 goods_info 的值为 {}，因此初次渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。 -->
<!-- 2.解决方案：判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏： -->
<!-- 如果goods_info.goods_name没有值就隐藏 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- #7.3.1 渲染轮播图区域 -->
		<!-- 1.使用 v-for 指令，循环渲染如下的轮播图 UI 结构： -->
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		<!-- 7.3.2 实现轮播图预览效果 -->
		<!-- 1.为轮播图中的 image 图片绑定 click 事件处理函数： -->
		<swiper-item v-for="(item,i) in goods_info.pics" :key='i'>
			 <!-- 把当前点击的图片的索引，传递到 preview() 处理函数中 -->
			<image :src="item.pics_big"  @click="preview(i)"></image>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item"></view>
		</swiper-item>
	</swiper>
	<!-- 7.3.3 渲染商品信息区域 -->
	<!-- 1.定义商品信息区域的 UI 结构如下 -->
	<!-- 商品信息区域 -->
	<view class="goods_info_box">
		<!-- 商品价格 -->
		<view class="price">¥{{goods_info.goods_price}}</view>
		<!-- 信息主体区域 -->
		<view class="goods_info_body"> 
			<!-- 商品名称(左侧) -->
			<view class="goods_name">{{goods_info.goods_name}}</view>
			<!-- 收藏（右侧） -->
			<view class="favi">
				<uni-icons type="star" size="18" color="gray"></uni-icons>
				<text >收藏</text>
			</view>	
		</view>
		  <!-- 运费 -->
			<view class="yf">快递：免运费</view>
	</view>
	<!-- 7.3.4 渲染商品详情信息 -->
	<!-- 1.在页面结构中，使用 rich-text 组件，将带有 HTML 标签的内容，渲染为小程序的页面结构： -->
	<!-- 商品详情信息 -->
	<rich-text :nodes="goods_info.goods_introduce"></rich-text>
	<!-- 7.4 渲染详情页底部的商品导航区域 -->
	<!-- 7.4.1 渲染商品导航区域的 UI 结构 -->
	<!-- 基于 uni-ui 提供的 GoodsNav 组件来实现商品导航区域的效果 -->
	<!-- 1、在 data 中，通过 options 和 buttonGroup 两个数组，来声明商品导航组件的按钮配置对象： -->
	<!-- 2、在页面中使用 uni-goods-nav 商品导航组件 -->
	<!-- 商品导航组件 -->
	<view class="goods_nav">
		<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		  <!-- fill 控制右侧按钮的样式 true or false-->
		  <!-- options 左侧按钮的配置项 -->
		  <!-- buttonGroup 右侧按钮的配置项 -->
		  <!-- click 左侧按钮的点击事件处理函数 -->
		  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 定义商品数据的节点（商品详情对象）
				goods_info:{},
					// <!-- 7.4.1 渲染商品导航区域的 UI 结构 -->
				// <!-- 1、在 data 中，通过 options 和 buttonGroup 两个数组，来声明商品导航组件的按钮配置对象： -->
				// 左侧按钮组的配置对象
				    options: [{
				      icon: 'shop',
				      text: '店铺'
				    }, {
				      icon: 'cart',
				      text: '购物车',
				      info: 2
				    }],
					// 右侧按钮组的配置对象
					    buttonGroup: [{
					        text: '加入购物车',
					        backgroundColor: '#ff0000',
					        color: '#fff'
					      },
					      {
					        text: '立即购买',
					        backgroundColor: '#ffa200',
					        color: '#fff'
					      }
					    ]
			};
		},
		// 获取商品的ID,并调用请求商品详情的方法(options已经传入395)
		onLoad(options) {
			// 获取商品的ID
			const goods_id = options.goods_id
			// 调用请求商品详情的方法
			this.getGoodsDetail(goods_id)
		},
		// 在 methods 中声明 getGoodsDetail 方法：
		methods:{
			  // 定义请求商品详情数据的方法
			 async getGoodsDetail(goods_id) {
			     const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
			     if (res.meta.status !== 200) return uni.$showMsg()
				 
				 // 7.3.4 渲染商品详情信息
				 // 2.修改 getGoodsDetail 方法，从而解决图片底部 空白间隙 的问题：
				 // 定义请求商品详情数据的方法(/<img /g)的字符串，进行“正则”替换，加上style属性display：block去除间隙
				 // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				 // 解决 .webp 格式图片在 ios 设备上无法正常显示的问题：/webp/g可以不用改，目前IOS可以执行
				  // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
				  res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp/g,'jpg')
				// 为 data 中的数据赋值
				this.goods_info = res.message
			  },
			  // 7.3.2 实现轮播图预览效果
			  // 2.在 methods 中定义 preview 事件处理函数
			  preview(i){
				    // 调用 uni.previewImage() 方法预览图片
					uni.previewImage({
						// 预览时，默认显示图片的索引
						current:i,
						// 所有图片 url 地址的数组urls：["","",""]这时候调用this.this.goods_info.pics的数组，然后调用.map进行循环，
						// 每循环一次都可以得到一个item项,就用x进行表示,然后返回x声明的属性(大图的路径),最后返回一个新数组,
						// 这个新数组就包含所有图片的urls地址
						urls:this.goods_info.pics.map(x=>x.pics_big)
					})
			  },
			  // 7.4.2 点击跳转到购物车页面
			  // 左侧按钮的点击事件处理函数,接收数据对象e
			  onClick(e){
				  // console.log(e);
				   // 从点击店铺接收到的e.content.text ==='购物车'，然后就可以执行跳转到购物车页面
				   if(e.content.text ==='购物车'){
					   uni.switchTab({
					   	url:'../../pages/cart/cart'
					   })
				   }
			  }
		}
	}
</script>

<style lang="scss">
	// <!-- #7.3.1 渲染轮播图区域 -->
	// 2.美化轮播图的样式：
swiper{ 
	height: 750rpx;
	image{
		width: 100%;
		height: 100%;
	}
}
// 7.3.3 渲染商品信息区域
// 2.美化商品信息区域的样式：
.goods_info_box{
	padding: 10px;
	padding-right: 0;
	.price{
		font-size: 18px;
		color: #c00000;
		margin: 10px 0;
	} 
	.goods_info_body{
		display: flex;
		justify-content: space-between;
		.goods_name{
			font-size: 13px;
			margin-right: 10px;
			
		}
		.favi{
			width: 120px;
			font-size: 12px; 
			display: flex;
			flex-direction: column;
			// 左右居中
			align-items: center;
			// 上下居中
			justify-content: center;
			border-left: 3px solid #efefef;
			color: gray;
		}
	}
	.yf{
		font-size: 12px;
		color: gray;
		margin: 10px 0;
	}
}
// 7.4.1 渲染商品导航区域的 UI 结构
// 3、美化商品导航组件，使之固定在页面最底部：
// 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
.goods-detail-container{
	padding-bottom: 50px;
}
.goods_nav{
	 // 为商品导航组件添加固定定位
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
</style>
