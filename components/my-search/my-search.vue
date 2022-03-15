<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchHandleer">
		<view class="my-search-box" :style="{'border-radius':rdaius+'px'}">
			<!-- style="{'background-color':bgcolor}"鍵值對，background是鍵，bgcolor是值 -->
			<!-- uni提供的圖標組件 -->
		 <uni-icons type="search" size="17"></uni-icons>
		 <text class="placeholder">搜索</text>
		 </view>
	</view>
</template>

<script> 
	export default {
		props:{
			// 背景顏色---通过 props 定义 bgcolor 和 radius 两个属性，并指定值类型和属性默认值：聲明兩個屬性
				bgcolor:{
					type:String,
					default:'#007AFF'
				},
				// 圓角尺寸
				rdaius:{
					type:Number,
					default:18
					// px
				}
		},
		data() {
			return {
				
			}
		},
		methods:{
			searchHandleer(){
				// console.log('~~~~'),
				this.$emit('click')
			} 
		}
		
	}
</script>

<style lang="scss">
	.my-search-container{
		// background-color: #007AFF;
		height: 50px;
		display: flex;
		align-items: center;
		padding:0 10px;
		// 內邊距

		.my-search-box{
			background-color: #FFFFFF;
			height: 36px;   
			width: 100%;
			// border-radius: 15px;
			justify-content: center;
			align-items: center;
			display: flex;
			// 彈性盒子
			
			.placeholder{
				  font-size: 15px;
				  margin: 5px;
				  // 文字和符號有個間隔距離
			}
		}
	}


</style>
