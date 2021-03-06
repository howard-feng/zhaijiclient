// pages/order/order.js
const app = getApp()
Page({
  /**
   * Page initial data
   */
  data: {
    order: [],
  },
  //刷新列表
  refreshOrderList:function(){
    var that = this
    //判断是配送员还是普通用户
    var isDeliverer = app.globalData.isDeliverer
    if(isDeliverer==true){
      wx.request({
        url: app.globalData.URL_BASE + app.globalData.GET_ORDER_RECEIVED_LIST,
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": app.globalData.zhaijiUserInfo.authorization,
        },
        success: function (res) {
          if (res.statusCode === 200 && res.data.errcode === 0) {
            var orderList = res.data.data
            //当账户为配送员时 将取消失败改为已拒绝
            if (app.globalData.isDeliverer ) {
              for(var i in orderList){
                if(orderList[i].status=='取消失败')
                  orderList[i].status = '已拒绝取消'
              }
            }
            that.setData({
              order: orderList
            })
            app.p(orderList)
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none'
            })
          }
        }
      })
    }else{
      wx.request({
        url: app.globalData.URL_BASE + app.globalData.GET_ONES_ORDER_LIST,
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": app.globalData.zhaijiUserInfo.authorization,
        },
        success: function (res) {
          app.p(res)
          if (res.statusCode === 200 && res.data.errcode === 0) {
            var orderList = res.data.data
            that.setData({
              order: orderList
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  //查看订单详情
  viewOrderDetail:function(event){
    var order_id = event.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '/pages/order/order_detail/order_detail?order_id='+order_id,
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (app.globalData.isRegistered == null) {//值为null代表还未执行wx.login 需要等待
      app.p('order先加载')
      app.OrderReadyCallback = isRegistered => {
        if (app.globalData.isRegistered === true) {
         
        } else {
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    } else {
      app.p('app先加载')
      if (app.globalData.isRegistered === true) {
      } else {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    //刷新订单列表
    if (app.globalData.isRegistered === true) {
      this.refreshOrderList()
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.refreshOrderList()
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})