<template>
	  <view>
    <view class="goods-list">
		<!-- 将循环时的 block 组件修改为 view 组件，并绑定 click 点击事件处理函数： -->
      <!-- <block v-for="(goods, i) in goodsList" :key="i"> -->
	  <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
		  <!-- 循环渲染时就可以使用<my-goods></my-goods>通过属性绑定的形式来传递goods的属性 ，他的属性就是我们循环项中的goods（item）项-->
       <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
	   <my-goods :goods='goods' ></my-goods>
	   <!-- 经过封装的程序也能够将商品页面成功的显示出来 -->
      <!-- </block> -->
	  </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				 // 請求參數對象,從API來的項目
				  queryObj: {
					 // 產品關鍵詞
					query: '',
					 // 產品分類
					cid: '',
					 // 頁碼值
					 pagenum: 1,
					 // 每頁顯示多少條數據
					 pagesize: 10,
				 },
				 // 获取商品列表的数据
				  // 声明商品列表的数据为
				 goodsList : [],
				 // 声明商品总数量为
				 total : 0,
				// 声明默认截流阀是关闭的状态
				 isloading:false
			}
		},
		// 頁面跳轉時可以透過onLoad(option)接收
		onLoad(options){
			// console.log(options);
			// 按下首页的关键词选项或是页面开启设置默认的分类，将携带的参数options.(query,cid)转存到queryObj上
			this.queryObj.query = options.query || ''
			 // ||或
			// 赋值给this.queryObj.query,如果没有query值就赋予空数值,避免进入默认值undefine(产生错误)
			this.queryObj.cid = options.cid || ''
			// console.log(this.queryObj);
			// 获取商品列表的数bkeqo1据
			// 调用获取商品数据的方法
			this.getGoodsList()
		},
		methods:{
			// 获取商品列表的数据
			// 定义获取商品数据的方法
			 async getGoodsList(cb) {
				 // 发起请求之前开始节流阀
				 this.isloading = true
				// 发起请求,还有请求的参数 queryObj，然后用async～await来优化这个异步请求（返回值是个对象{data:重命名为res}
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 当完成请求后,关闭截流阀
				this.isloading = false
				// 3、如果cb的值存在,就进行调用(短路运算符)关闭下拉刷新（已经刷新过了cb信号）
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				// 改造 methods 中的 getGoodsList 函数，当列表数据请求成功之后，进行新旧数据的拼接处理：
				// 展开新数据...this.goodsList,...res.message.goods 完成新旧数据的拼接
				this.goodsList = [ ...this.goodsList, ...res.message.goods]
				// this.goodsList = res.message.goods
				// console.log(this.goodsList); 
				// console.log(res);
				this.total = res.message.total
			},
			// 点击跳转到商品详情页面
			gotoDetail(goods){
				uni.navigateTo({
					// 用？id形态把id传参过去就可以了,注意？不要留空格
					url:'../goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		// 触底的事件
		onReachBottom(){
			  // 判断是否还有下一页数据（注意大于等于的符号写法，大小于在前，等于在后）
			 if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断isloading的状态,如果是true就退出(判断是否正在请求其它数据，如果是，则不发起额外的请求)
			if (this.isloading) return
			// 让页码自增+1
			this.queryObj.pagenum += 1
			// 重新获取列表数据
			this.getGoodsList()
			// 改造 methods 中的 getGoodsList 函数，当列表数据请求成功之后，进行新旧数据的拼接处理：
		},
		// 监听页面的onPullDownRefresh事件的处理函数（下拉刷新
		onPullDownRefresh(){
			// 1、重置关键数据
			this.queryObj.pagnum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			// 2、重新发起网络数据请求,并传进一个回调函数（cb)在getGoodsList()，且调用uni.stopPullDownRefresh()关闭下拉刷新
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>
 
<style lang="scss">

</style>
