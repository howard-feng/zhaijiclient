//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.URL_BASE+this.globalData.GET_OPEN_ID,
          data:{"code":res.code},
          method:"POST",
          success:function(res){
            if(res.statusCode===200){
              // 发送 res.code 到后台换取 openId
              that.globalData.open_id = res.data.data.open_id
              // 查看是否注册
              wx.request({
                url: that.globalData.URL_BASE + that.globalData.LOGIN,
                data: { "open_id": that.globalData.open_id},
                method: "POST",
                success: function (res) {
                    //用户未注册,跳转至手机验证页面
                    if(res.data.errcode===-4002){
                      wx.navigateTo({
                        url: '/pages/index/index',
                      })
                    }else if(res.data.errcode===0){
                      that.globalData.zhaijiUserInfo = res.data.data
                      that.initLogin
                    }
                }
              })
            }
          }
        })
      }
    })
    // 获取用户信集送送s    
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log(this.globalData.userInfo)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  initLogin: function () {

  },
  globalData: {
    zhaijiUserInfo:null,
    userInfo: null,
    open_id :"123",
    // api_url
    URL_BASE:"https://zhaiji.hammerfood.cn",
    // URL_BASE: "https://api.zhaiji.xyz",
    GET_OPEN_ID: "/code",//POST
    LOGIN: "/login",//POST
    GET_CAPTCHA: "/msg/send",//POST 
    VERIFY_CAPTCHA: "/msg/verify", //POST 
    ADD_USER: "/user",//POST
    REVISE_USER: "/user",//PATCH
    GET_ONES_ORDER_LIST: "/order",//GET
    GET_ONES_ORDER_DETAIL: "/order/{order_id}",//GET
    ADD_ORDER: "/order",//POST
    CANCEL_ORDER: "/order/cancel/{order_id}",//PATCH
    CONFIRM_ORDER: "/order/confirm/{order_id}",//PATCH
    MARK_ORDER: "/order/mark/{order_id}",//PATCH
    ADD_ADDRESS: "/address/",//POST
    DELETE_ADDRESS: "/address/{address_id}",//DELETE
    REVISE_ADDRESS: "/address/{address_id}",//PATCH
    GET_ORDER_CAN_GET_LIST: "/order/{start}/{limit}",//GET
    RECEIVE_ORDER: "/deliverer/receive/{order_id}"//POST
  }
})