
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象（导入网络请求的包）
import { $http } from '@escook/request-miniprogram'

// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 请求的根路径,注意Url 有区分大小写,方便各页面调用，只需要调用后面的网址就可以了，for ex ('/api/public/v1/home/swiperdata')
$http.baseUrl= 'https://www.uinav.com'

// 请求拦截器～～请求开始之前做一些事情
$http.beforeRequest = function (options) {
  // do somethimg...
  uni.showLoading({
  	title:'数据加载中...'
  })
}
// 响应拦截器～～请求完成之后做一些事情
$http.afterRequest = function () {
  // do something...
  uni.hideLoading()
}

// 封装弹框的方法(全局)应用在promise优化（async await)的请求失败执行上
uni.$showMsg = function(title ='数据请求失败',duration =1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif