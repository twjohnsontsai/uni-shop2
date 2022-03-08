	<!-- wxml格式，标签 -->
<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 轮播图的相关属性的设置，还有时间停留秒速，循环 -->
			<swiper-item v-for="(item,i) in swiperList" :key='i' >
				<!-- 轮播图项目的循环item，i是索引 :是绑定-->
				<navigator class="swiper-item"  :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<!-- 用？来传递参数 ,：url动态绑定小程序分包subpkg的路径''搞起来i就是一个字符串，就是goods_id，也就是一个路径加商品ID的一个字符串-->
					<image :src="item.image_src" ></image>
				</navigator>
			</swiper-item>
		</swiper>
			<!-- 分类导航区域  渲染分类导航的UI结构  注意还是在view里面-->
			<view class="nav-list">
				<view class="nav-item" v-for="(item,i) in navList" :key='i' @click="navClickHandler(item)">
					<image :src="item.image_src" class="nav-img" ></image> 
				</view>
			</view>
			<!-- 楼层区域 -->
			<!-- 楼层的容器 -->
			<view class="floor-list">
				<!-- 每一个楼层的item项目 -->
				<!-- 循环渲染 v-for="(item,i) in floorList" :key="i" -->
				<view class="floor-item" v-for="(item,i) in floorList" :key="i">
					<!-- 楼层的标题 注意每一个单字都不能错 -->
					<image :src="item.floor_title.image_src" class="floor-title"></image>
					<!-- 楼层的图片区 -->
					<view class="floor-img-box">
						<!-- 左侧的图片区  大图片区-->
						<navigator class="left-img-box" :url="item.product_list[0].url">
							<!-- message中的数组索引值为0，也就是第一张图片 -->
							<!-- 绑定图片的宽度style = "{width :item.product_list[0].image_width + 'rpx'}"没有单位的话可以手动加上rpx -->
							<image :src="item.product_list[0].image_src" :style = "{width :item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
						<!-- 右图片区 4个小图片 -->
						<view class="right-img-box">	
						 <!-- 循环渲染分别为item2，i2 ，v-for="(item2,i2)  in item.product_list " :key= 'i2' -->
						<navigator class="right-img-item" v-for="(item2,i2)  in item.product_list " :key= 'i2' v-if="i2 !==0" :url="item2.url">
							<!-- 如果索引的值不等于0的话就继续执行，如果等于0就不执行渲染图片v-if="i2 !==0" -->
							<image :src="item2.image_src"  :style = "{width:item2.image_width+'rpx'}" mode="widthFix"></image>
						</navigator>
						</view>
					</view>
				</view>
			</view>
	</view>

</template>
<!-- Java Script的设置 -->
<script>
	export default {
		data() {
			return {
			// 定义轮播图的数据表,就是swiperList[ ]空数组
			swiperList: [],
			// 分类导航的数据空数组
			navList:[],
			//定义楼层的数据
			floorList:[]
			};
		},
		onLoad() {
			// 调用方法，获取轮播图的数据
			this.getSwiperList(),
			// 调用方法,获取导航栏的数据
			this.getNavList(),
			//调用方法:获取楼层数据的方法
			this.getFloorList()
		}, 
		methods:{
			// 用promise优化()async await),执行调用指定网址中的API数据
			async getSwiperList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// console.log(res)
				// *********从res获取一个结构性属性dada，并重新命名为res*******，取得数据后就可以进行
				if (res.meta.status !== 200) return uni.$showMsg()
				// 改为封装后的全局uni.$showMsg()，下面就可以删除了
				// {
				// 	return uni.showToast({
				// 		title:'数据请求失败',
				// 		duration:1500,
				// 		icon:'none'
				// 	})					
				// }
				// 如果成功就把res.message的数据交给swiperList 
				this.swiperList = res.message
				uni.$showMsg('数据请求成功')
			},
			async getNavList(){
				// 测试获得调试的结果,并借此获悉res的结构,并找出相关属性值,以利后续的赋值，再转成下段的代码就可以再AppData获取到数据
				// const res= await uni.$http.get('/api/public/v1/home/catitems')
				// console.log(res);
				const {data:res}= await uni.$http.get('/api/public/v1/home/catitems')
				if(res.meta.status!==200) return uni.$showMsg()
				this.navList = res.message
			} ,
			//	定义事件处理函数navClickHandler
			navClickHandler(item){
			if (item.name === '分类'){
				uni.switchTab({
					url : '../cate/cate'
					//分类页面要调用tabbar只能调用switchTab,注意备注的符号有所不同
				})
			}},
			//定义获取楼层列表数据的方法
			async getFloorList(){
				const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
				if ( res.meta.status !== 200) return uni.$showMsg()
				
				// 对数据进行处理，当拿到 res.message时对 res.message进行forEach循环，对forEach所拿到的数据都时一个楼层的数据
				res.message.forEach(floor =>{
					floor.product_list.forEach(prod=>{
						// prod所指向就是当前每一个图片的所有信息对象，并替换message的网址"/pages/goods_list?query=服饰"
						prod.url = '/subpkg/goods_list/goods_list?' +  prod.navigator_url.split('?')[1]
						// 置换为当前网址(前段)'/subpkg/goods_list/goods_list?' +(后段)prod.navigator_url.solit('?')[1]网址中以？分隔,选择索引[1],即为query=服饰"
					})
				})
				// 对floorList 赋值
				this.floorList = res.message
			}

			},
		}
</script>
<!-- 样式的设置css -->
<style lang="scss">
swiper{
	height: 330rpx;
	.swiper-item,
	image{
		width: 100%;
		height: 100%;
	}
}
.nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px,0;
	.nav-img{
		height: 140rpx;
		width: 128rpx;
					}
			}
			// 要注意不要进错家门
	.floor-title{
		width: 100%;
		height: 60rpx;
					}
					
.floor-img-box{
	display: flex;
	padding-left: 10rpx;
}
					
.right-img-box{
	display: flex;
	flex-wrap: wrap;
	// 自动换行
	justify-content: space-around;
	// 周边自动调整对应
}
</style>
