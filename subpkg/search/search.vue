<template>
	<view>
		<view class="search-box">
			<uni-search-bar  :radius="100" @input="input" cancelButton='none' ></uni-search-bar>
		</view>
		<!-- 搜索建議列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<!-- 跳轉到商品詳細頁面 -->
			<view class="sugg-item"  v-for="(item,i) in searchResults " :key='i' @click="gotoDetail(item)">
				<view class="sugg-name">{{item.goods_name}}></view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索歷史 -->
		<view class="histroy-box" v-else>
			<!-- 標題區域 -->
			<view class="histroy-title">
				<text>搜索歷史</text>
				<!-- 刪除關鍵詞和歷史搜索數據 -->
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表區域 -->
			<view class="histroy-list">
				<!-- 應用到標籤 -->
				<!-- 點擊搜索歷史跳轉到商品列表頁面 -->
				<uni-tag  :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>

	
</template>

<script>
	export default {
		data() {
			return {
			// 延時器的timerID
				timer: null,
				// 搜索關鍵詞
				kw:'',
				// kw為空，方便填入搜索關鍵詞數據
				// 搜索結果列表
				searchResults:[],
				// 搜索結果列表
				historyList: []
			};
		},
		// 在 onLoad 生命周期函数中，加载本地存储的搜索历史记录：
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods:{
			// 輸入事件函數
			input(e){
				// 清楚除imer對應的延時器
				clearTimeout(this.timer)
				// console.log(e);
				// 重啟一個延時器,並把timerID復職給this,timer
				this.timer = setTimeout(()=>{ 
					// 如果500毫秒內沒有觸發新的輸入事件,則為搜索關鍵詞復職
					this.kw=e
					// console.log(this.kw)
					// 在防抖的setTimeout中,调用getSearchList方法获取建议列表
					this.getSearchList()
					// 根据关键词查询搜索建议列表
				},500)
			},
			// 定义getSearchList的获取方法
			async getSearchList(){
				// 判断搜索关键词是否为空
				if(this.kw.length === 0){
					// 这时候就赋值给searchResult为空数组，然后return出去,清空輸入欄位
					this.searchResults = []
					return
				}
				// 通過get如果有取得api的數值然後賦值給res,如果res.meta.status不等於200就顯示$showMsg，
				// 如果是獲得數值就存入searchResults
				 const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
				  if (res.meta.status !== 200) return uni.$showMsg()
				  this.searchResults = res.message
				  // 查詢到搜索建議後,調用saveSearchHistory() 方法保存相關搜索關鍵詞
				  this.saveSearchHistory()
			},
			// 綁定商品列表方法,定義gotoDetail(item)的方法@click=‘gotoDetail(item)
			gotoDetail(item){
				// console.log(item.goods_id);
				uni.navigateTo({
					url:'../goods_detail/goods_detail?goods_id =' + item.goods_id
				})
			},
			// 將關鍵詞push到historyList
			saveSearchHistory(){
				// this.historyList.push(this.kw)
				// 用unshift就可以直接從前面追加搜索詞，但是涉及到單一set的問題，所以這裡無法使用
				// this.historyList.unshift(this.kw)
				// 把關鍵詞設置為唯一,就是關鍵詞不重複
				// 將Array數組轉換為Set對象
				const set = new Set(this.historyList)
				// 調用Set對象的delete方法移除對應的元素（先移除增加的關鍵詞）
				set.delete(this.kw)
				// 調用Set對象的add方法向Set中添加元素
				set.add(this.kw)
				// 將Set對象轉化為Array數組
				this.historyList= Array.from(set)
				// console.log(set);
				// 對搜索歷史數據進行持久化存儲
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
			},
			// 在 methods 中定义 cleanHistory 处理函数：
			// 清空搜索历史记录
			clean(){
				// 清空 data 中保存的搜索历史
				this.historyList = [],
				 // 清空本地存储中记录的搜索历史
				uni.setStorageSync('kw','[ ]')
			},
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'../goods_list/goods_list?query=' + kw
				})
			}
		},
		// 解決關鍵詞前後次序的問題
		// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
		    // 而是应该新建一个内存无关的数组，再进行 reverse 反转
		computed:{
			histories(){
				return [...this.historyList].reverse()
			}			
		}
	}
</script>

<style lang="scss">
.search-box{
	// 設置定位效果為吸頂
	position: sticky;
	// 吸頂的位置
	top: 0;
	// 提高層級
	z-index: 999;
}
.sugg-list{
	// 内间距，左右5px
	padding: 0 5px;
	.sugg-item{
		font-size: 13px;
		    padding: 13px 0;
			// 边框
		    border-bottom: 1px solid #AFAFAF;
		    display: flex;
		    align-items: center;
		    justify-content: space-between;

		.sugg-name{
			// 文字不允许换行(单行文字)
			white-space: nowrap;
			// 溢出部分隐藏
			 overflow: hidden;
			 // 文本溢出后使用...代替
			text-overflow: ellipsis;
			      margin-right: 3px;
		}
	}
}
.histroy-box{
	padding: 0 5px;
	.histroy-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.histroy-list{
		display: flex;
		flex-wrap: wrap;
		.uni-tag{
			margin-top: 5px;
			margin-left: 5px;
		}
	}
}
</style>
