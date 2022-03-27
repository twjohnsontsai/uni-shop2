// 8.2 创建购物车的 store 模块
// 1.在 store 目录上鼠标右键，选择 新建 -> js文件，创建购物车的 store 模块，命名为 cart.js：
// 2.在 cart.js 中，初始化如下的 vuex 模块
// 通过export default导出vuex的模块
export default{
	  // 为当前模块开启命名空间
	  namespaced: true,
	  
	   // 模块的 state 数据，通过模块state的方法来返回state的节点
	   state: () => ({
		   // 购物车的数组，用来存储购物车中每个商品的信息对象
		       // 每个商品的信息对象，都包含如下 6 个属性：
		       // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state } goods_state是否已经勾选
		       // 8.6.3修改 cart.js 模块中的 state 函数，读取本地存储的购物车数据，对 cart 数组进行初始化：
			cart:JSON.parse(uni.getStorageSync('cart') || '[]')
			// JSON.parse转成真正的数组（之前已经数组转为字符串JSON.stringify）
			// 调用uni.setStorageSync读取本地所存储购物车的数据cart，如果本地没有存的话||就给个空数组的字符串
			   }),
			   // 8.4 实现加入购物车的功能
			   // 8.4.1在 store 目录下的 cart.js 模块中，封装一个将商品信息加入购物车的 mutations 方法，命名为 addToCart。示例代码如下：
	// 模块的 mutations 方法(state只能用mutation才能修改)封装addToCart的方法
	mutations: {
		addToCart(state,goods){
			// state就是原有的商品项，goods就是新增的商品项目 
			// 根据提交的商品的id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			// console.log(findResult); 
			// 从state中的商品逐一比对新增商品项goods的goods_id,每一个商品项用X表示，如果当前循环项的goods_id等于或是不等于goods传过来的id
			if (!findResult) {
				// 如果不符合就显示undefine直接push商品项
				state.cart.push(goods)
			} else {
				findResult.goods_count++
				// 如果符合的话就显示findResult，增加数量就可以，
				}
				// console.log(state.cart);
				
				// 8.6.2修改 mutations 节点中的 addToCart 方法，在处理完商品信息后，调用步骤 1 中定义的 saveToStorage 方法：
				// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
				   this.commit('m_cart/saveToStorage')
		},
		// 8.6 持久化存储购物车中的商品
		// 8.6.1在 cart.js 模块中，声明一个叫做 saveToStorage 的 mutations 方法，此方法负责将购物车中的数据持久化存储到本地：
		saveToStorage(state){
			// JSON.stringify为将(state.cart)数组转为字符串
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		// 9.1.5 修改购物车中商品的勾选状态
		// 9.1.5.1在 store/cart.js 模块中，声明如下的 mutations 方法，用来修改对应商品的勾选状态：
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
		  // 根据 goods_id 查询购物车中对应商品的信息对象
		  const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
		
		  // 有对应的商品信息对象
		  if (findResult) {
		    // 更新对应商品的勾选状态
		    findResult.goods_state = goods.goods_state
		    // 持久化存储到本地(不是服务器)
		    this.commit('m_cart/saveToStorage')
		  }
		},
		// 9.1.10 修改购物车中商品的数量
		// 9.1.10.1在 store/cart.js 模块中，声明如下的 mutations 方法，用来修改对应商品的数量：
		// 9.1.10.1.1更新购物车中商品的数量
		updateGoodsCount(state, goods) {
		  // 9.1.10.1.2根据 goods_id 查询购物车中对应商品的信息对象
		  const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
		
		  if(findResult) {
		    // 9.1.10.1.3更新对应商品的数量
		    findResult.goods_count = goods.goods_count
		    // 9.1.10.1.4持久化存储到本地,再把mutation数据映射到cart.ave页面上
		    this.commit('m_cart/saveToStorage')
		  }
		},
		// 9.1.12 实现滑动删除的功能
		//9.1.12.1 在 store/cart.js 模块的 mutations 节点中声明如下的方法，从而根据商品的 Id 从购物车中移除对应的商品：
		// 9.1.12.1.1根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
		  // 9.1.12.1.2调用数组的 filter 方法进行过滤，拿当前的id和传过来的商品id进行比较，如果是不相等的id就赋值给新的数组cart
		  state.cart = state.cart.filter(x => x.goods_id !== goods_id)
		  // 9.1.12.1.3持久化存储到本地
		  this.commit('m_cart/saveToStorage')
		},
		// 9.3.5 实现商品的全选/反选功能
		// 9.3.5.1在 store/cart.js 模块中，定义一个叫做 updateAllGoodsState 的 mutations 方法，用来修改所有商品的勾选状态：
		// 9.3.5.1.1更新所有商品的勾选状态(接收两个数值，一个是state就是商品资料库，另一个是赋予商品新的勾选状态值)
		updateAllGoodsState(state, newState) {
		  // 9.3.5.1.2循环更新购物车中每件商品的勾选状态
		  state.cart.forEach(x => x.goods_state = newState)
		  // 9.3.5.1.3持久化存储到本地，循环完毕后一定要调用commit方法存储数据
		  this.commit('m_cart/saveToStorage')
		}
	}, 
	// 8.5 动态统计购物车中商品的总数量
	// 8.5.1.在 cart.js 模块中，在 getters 节点下定义一个 total 方法，用来统计购物车中商品的总数量
	// 模块的 getters 属性
getters: {
   // 统计购物车中商品的总数量（所有商品和数量）
   total(state) {
   //    let c = 0 
   //    // 循环统计商品的数量，累加到变量 c 中
   //    state.cart.forEach(x => c += x.goods_count)
   //    return c
	  //9.3.4.3.1 调用数组的reduce方式来优化上面total的统计方法，0就是初始值，也就是上面的let c 只在第一次循环的时候会引用
	  // 9.3.4.2每执行一次循环就可以拿到上次累加的结果total，然后每一次reduce循环都可以拿到item项
		return state.cart.reduce((total,item)=> total += item.goods_count,0)
   },
   // 9.3.3 动态渲染已勾选商品的总数量
   // 9,3,3,1在 store/cart.js 模块中，定义一个名称为 checkedCount 的 getters，用来统计已勾选商品的总数量：
   // 9.3.3.1.1勾选的商品的总数量
   checkedCount(state) {
     // 先使用 filter 方法，从购物车中过滤器已勾选的商品+再使用 reduce 方法，将已勾选的商品总数量进行累加
     // reduce() 的返回值就是已勾选的商品的总数量
     return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
	 //从购物车的数据state.cart.filter进行过滤，来选取已经勾选的商品用.filter的方法过滤出来（x.goods_state是不是等于true
	 // filter的返回值是一个新数组，里面包含着所有已经勾选的商品，
	 // 然后再一次进行循环，这次调用reduce的方法，接收两个参数
	 // 第一个函数是回调((total, item) => total += item.goods_count，第二个函数是一个初始值0；
	 // 形参里可以接收两个参数，第一个是累加的合total，第二个是循环的item项
	 // 每循环一次都可以让累加+=item.goods_count，当累加完毕后需要将结果return出去（当回调函数行数只有一行，可以省略花挂号和return）
	 // 再把reduce的结果return出去，就是checkcount的结果
   },
   // 9.3.6 动态渲染已勾选商品的总价格
   // 9.3.6.1`在 store/cart.js 模块中，定义一个叫做 checkedGoodsAmount 的 getters，用来统计已勾选商品的总价格：
   // 9.3.6.1.1已勾选的商品的总价
   checkedGoodsAmount(state) {
     // 先使用 filter 方法，从购物车中过滤器已勾选的商品
     // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
     // reduce() 的返回值就是已勾选的商品的总价
     // 最后调用 toFixed(2) 方法，保留两位小数
     return state.cart.filter(x => x.goods_state)
                      .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
                      .toFixed(2)
   }
},
}