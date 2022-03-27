<template>
	<view>
				<!-- <my-search :bgcolor="'black' " :rdaius="'30'"></my-search> -->
				<!-- 有了增強屬性就可以在my-search賦值進行調整 -->
				<my-search @click='gotoSearch' ></my-search>
		<view class="scroll-view-container">
			<!-- 左侧的滑动区域 -->
			<!-- 固定高度的设置 -->
			<!-- <scroll-view scroll-y="true" style="height: 300px;" class="left-scroll-view"> -->
			<!-- 屏幕跟着手机型号进行变动的高度绑定“：style” -->
			<scroll-view scroll-y="true" :style="{height: wh+'px'}" class="left-scroll-view">
				<!-- 同时添加字符串或是指令先选择要修改的位置，再按住crtl+option+CMD，选择需要修改的列后，再用箭头按键移动，就可以添加了 -->
				<!-- 循环渲染列表结构 -->
				<block v-for="(item,i) in cateList" :key='i'>
				<!-- 	<view class="left-scroll-view-item ">{{item.cat_name}}</view> -->
				<!-- 要使用选中索引时需要增加.active，对class进行绑定 -->
				<!-- <view :class="['left-scroll-view-item' , i===active? 'active' : ''] ">{{item.cat_name}}</view> -->
				<!-- 为索引添加绑定，就是按键 -->
				<view :class="['left-scroll-view-item' , i===active? 'active' : ''] " @click="activeChange(i)">{{item.cat_name}} </view>
				</block>
				
				
			</scroll-view>
			 <!-- 右侧的滑动区域 -->
			 <!-- <scroll-view scroll-y="true" :style="{height: wh+'px';}"> -->
			<scroll-view scroll-y="true" :style="{height: wh+'px'}" :scroll-top="scrollTop">
				<!-- 没有绑定时，相对的数据就不会有变化，注意绑定： -->
				<!-- 渲染二级分类 -->
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<!-- 二级分类的标题 -->
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!-- 当前二级分类下的三级分类列表 -->
					<view class="cate-lv3-list">
						<!-- 三级分类的item项目 -->
						<view class="cate-lv3-item"  v-for="(item3,i3) in item2.children" :key='i3' @click="getGoodsList(item3)">
							<image :src="item3.cat_icon" ></image>
							<!-- 绑定对应的图片 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view> 	
			 </scroll-view>
		</view>
	</view> 
</template>

<script>
	// 8.9.2修改 home.vue，cate.vue，cart.vue，my.vue 这 4 个 tabBar 页面的源代码，分别导入 @/mixins/tabbar-badge.js 模块并进行使用：
	// 8.9.2.1导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 8.9.2.2将 badgeMix 混入到当前的页面中进行使用
		  mixins: [badgeMix],
		data() {
			return {
				// 设定当前设备可用的高度
				wh:0,
				
				// 定义分类数据节点
				cateList:[],
				// 选中的索引
				active:0,
				// 定义二级分类的列表
				cateLevel2:[],
				scrollTop:0
				
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			// console.log(sysInfo);
			// 给当前可用高度赋值
			this.wh = sysInfo.windowHeight - 50
			// 然后就可以到scroll-view的高度进行动态高度的绑定:style
			// -50px為扣除my-search的高度，這樣才能避免最後把search給拉沒了
			
			
			// 调用获取分类表数据的方法
			this.getCateList()
		},
		// 定义获取分类表数据的方法
		methods:{
			// 发起异步请求
			async getCateList(){
					const{data:res}=await uni.$http.get("/api/public/v1/categories")
					// 判断是否获取失败
					if (res.meta.status !== 200 )  return uni.$showMsg()
					// 转存数据，就是将从api获取到的数据，赋值给cateList（一级分类）
					this.cateList = res.message
					
					// 为二级分类赋值,先传入active=0的初始值(data里的数据都是数组[ ])
					this.cateLevel2 = res.message[0].children
					
			},
			// 按键选中项改变，的事件处理函数,先做索引声明，拿到索引后，再对data里的active进行重新赋值就既可以了
			activeChange(i){
				this.active=i
				
				// 重新为cateLevel2赋值
				this.cateLevel2=this.cateList[i].children
				
				// scroll不能都是0,这样不会有变化,需要在0和1之间设置,所以需要调整如下
				this.scrollTop = this.scrollTop ===0 ? 1 : 0
			},
			// 点击三级分类项目,跳转到商品列表页面，定义事件函数的方法
			getGoodsList(item3) {
			  uni.navigateTo({
			    url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				// 注意参数的传递网址的部分后面股东是？cid=传递了？分类的id，再+api的索引项
				})
			},
			gotoSearch(){
				// console.log('ok');
				// 跳轉到分包的路徑
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container{
		display: flex;
	}
		.left-scroll-view{
			width: 120px;
			// 希望宽度或是高度固定就使用px
			.left-scroll-view-item{
				background-color: #f7f7f7;
				line-height: 60px;
				text-align: center;
				font-size: 12px;
				// 激活active,在属性中增加一个active,然后&.active,增加激活属性的条件
				&.active{
					background-color: #FFFFFF;
					// 每个元素都有两个伪元素,一个是before，一个是after(就是在字串的前、后两端)
					position: relative;
					// 父元素相对定位，和子元素before相对应
					
					// 在为元素前添加一个红色的竖条,这样容易辨识
					&::before{
						content: '';
						display: block;
						width: 10rpx;
						height: 30px;
						background-color: #C00000;
						position: absolute;
						// 子元素，绝对定位
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						// 往回撤50%
					}
				}
			}
			
		}
		.cate-lv2-title{
			font-size: 12px;
			font-weight:bold ;
			text-align: center;
			padding: 15px 0;
		}
		.cate-lv3-list{
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 10px;
			.cate-lv3-item{
				width: 33.33%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				image{
				width: 60px;	
				height: 60px;
				} 
				text{
					font-size: 12px;
				}
			}
		}
</style>
