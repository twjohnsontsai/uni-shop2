<template>
	<view>
		My
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
				
			};
		}
	}
</script>

<style lang="scss">

</style>
