<template>
	<view class="goods-item">
	  <!-- 商品左侧图片区域 -->
	  <view class="goods-item-left">
	    <image :src="goods.goods_small_logo|| defaultPic " class="goods-pic"></image>
		<!-- ||defaultPic 默认图片，||或是（也就是一旦没有值，不要进入defend，给他设置一个默认值） -->
	  </view>
	  <!-- 商品右侧信息区域 -->
	  <view class="goods-item-right">
	    <!-- 商品标题 -->
	    <view class="goods-name">{{goods.goods_name}}</view>
	    <view class="goods-info-box">
	      <!-- 商品价格 -->
		  <!-- 通过管道符 "|"号（符号的意思：用goods.goods_price的输出值作为tofixed的输入值）调用tofixed，就可以执行增加2位小数点的符号 -->
	      <view class="goods-price">￥{{goods.goods_price | tofixed }}</view>
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
			}
		},
		name:"my-goods",
		data() {
			return {
			// 默认的图片
			defaultPic : 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'	
			};
		},
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
.goods-list{
	.goods-item{
		display: flex;
		padding: 5px 10px;
		border-bottom: 1px solid #F0F0F0;
		.goods-item-left{
			margin-right: 5px;
			.goods-pic{
				height: 100px;
				width: 100px;
				display: block;//防止图片下面有一定空白的间隙
			}
		}
		.goods-item-right{
			display: flex;//弹性分布
			flex-direction: column;//纵向布局
			justify-content: space-between;//上下两端贴边
			.goods-name{
				font-size: 13px;
			}
			.goods-info-box{
				.goods-price{
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
	
}
</style>
