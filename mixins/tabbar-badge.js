// 8.9 将设置 tabBar 徽标的代码抽离为 mixins
// 注意：除了要在 cart.vue 页面中设置购物车的数字徽标，还需要在其它 3 个 tabBar 页面中，为购物车设置数字徽标。
// 此时可以使用 Vue 提供的 mixins 特性，提高代码的可维护性。
// 8.9.1在项目根目录中新建 mixins 文件夹，并在 mixins 文件夹之下新建 tabbar-badge.js 文件，用来把设置 tabBar 徽标的代码封装为一个 mixin 文件
import { mapGetters } from 'vuex'

// 向外暴露出（导出）一个 mixin 对象
export default {
	computed:{
		// 将 m_cart 模块中的 total 映射为当前页面的计算属性(cart.js:55)
		    ...mapGetters('m_cart', ['total']),
	},
	// 9.3.7 动态计算购物车徽标的数值
	// 9.3.7.1问题说明：当修改购物车中商品的数量之后，tabBar 上的数字徽标不会自动更新。
	// 9.3.7.2解决方案：改造 mixins/tabbar-badge.js 中的代码，使用 watch 侦听器，监听 total 总数量的变化，从而动态为 tabBar 的徽标赋值：
	 watch: {
	    // 监听 total 值的变化
	    total() {
	      // 调用 methods 中的 setBadge 方法，重新为 tabBar 的数字徽章赋值
	      this.setBadge()
	    },
	  },
	// 8.8.2在页面刚显示出来的时候，立即调用 setBadge 方法，为 tabBar 设置数字徽标：
	onShow() {
	   // 在页面刚展示的时候，设置数字徽标
	   this.setBadge() 
	},
	methods:{
		// 8.8.3在 methods 节点中，声明 setBadge 方法如下，通过 uni.setTabBarBadge() 为 tabBar 设置数字徽标
		setBadge() {
		      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
		      uni.setTabBarBadge({
		         index: 2, // 索引次序，购物车的索引是2
		         text: this.total + '' // 注意：text 的值必须是字符串，不能是数字所以加上一个‘’字符串，数字就成字符串
		      })
		   }
	}
	} 