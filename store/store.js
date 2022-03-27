// 8.1 配置 vuex
// 1.在项目根目录中创建 store 文件夹，专门用来存放 vuex 相关的模块
// 2.在 store 目录上鼠标右键，选择 新建 -> js文件，新建 store.js 文件：
// 3.在 store.js 中按照如下 4 个步骤初始化 Store 的实例对象
//1-3- 1. 导入 Vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 8.2 创建购物车的 store 模块
// 3.在 store/store.js 模块中，导入并挂载购物车的 vuex 模块，示例代码如下
// 2-3-1. 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 9.2.4.2在 store/store.js 模块中，导入并挂载 user.js 模块：
// 9.2.4.2.1导入用户的 vuex 模块
import moduleUser from './user.js'

//1-3- 2. 将 Vuex 安装为 Vue 的插件
 Vue.use(Vuex)
 
 // 1-3-3. 创建 Store 的实例对象
 const store = new Vuex.Store({
	 // TODO：挂载 store 模块
	 modules:{
		     // 2-3-2. 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
		     //    购物车模块中 cart 数组的访问路径是 m_cart/cart
			 'm_cart':moduleCart,
			 // 9.2.4.2.2挂载用户的 vuex 模块，访问路径为 m_user
			'm_user': moduleUser
	 },
	 })
	 
	 // 1-3-4. 向外共享 Store 的实例(实际)对象
	 export default store