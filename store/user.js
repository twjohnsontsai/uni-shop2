// 9.2.4 将 address 信息存储到 vuex 中
// 9.2.4.1在 store 目录中，创建用户相关的 vuex 模块，命名为 user.js
export default {
	  // 9.2.4.2开启命名空间
	namespaced: true,
	// 9.2.4.3定义一个state数据节点，返回一个数据对象
	 state: () => ({
		// 9.2.4.2.1收货地址
		// address:{},
		// 9.2.5.3. 初始化～读取持久化存储到本地的收货地址数据，初始化 address 对象：调用JSON.parse进行转化，
		// 再转化时透过uni.getStorageSync的方法来进行读取('address')，如果读取失败就字符串返回空对象（代表本地原来没有值）
		 address: JSON.parse(uni.getStorageSync('address') || '{}'),
	}),
	// 9.2.4.3 定义mutation的方法指向一个对象，修正state的方法
	mutations:{
		// 9.2.4.3.1更新收货地址（updateAdress第一个参数永远都是state,第二个是传递过来的address）
		updateAddress(state,address){
			//9.2.3.3.2 赋予state.address新传递过来的address
			state.address = address
			// 9.2.5.2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			      this.commit('m_user/saveAddressToStorage')
		},
		// 9.2.5 将 Store 中的 address 持久化存储到本地
		// 9.2.5.1修改 store/user.js 模块中的代码如下：
		 // 9.2.5.1.1. 定义将 address 持久化存储到本地 mutations 方法:定义 saveAddressToStorage就是调用uni.setStorageSync
		 // 将JSON.stringify(state.address)转成字符串，存储到本地address上
		  saveAddressToStorage(state) {
		       uni.setStorageSync('address', JSON.stringify(state.address))
		     },
	},
	// 9.2.4.4数据包装器
	getters:{	
		// 9.2.6 将 addstr 抽离为 getters～～目的：为了提高代码的复用性，可以把收货的详细地址抽离为 getters，方便在多个页面和组件
		// 之间实现复用。9.2.6.1 剪切 my-address.vue 组件中的 addstr 计算属性的代码，粘贴到 user.js 模块中，作为一个 getters 节点：
		addstr(state){  //先接收下state来做this的替换
			if (!state.address.provinceName) return ''
			// 9.2.6.1.1.1因为vuex无法识别this所以用state替代
			return state.address.provinceName+state.address.cityName + state.address.countyName + state.address.detailInfo
		},
	},
	}
