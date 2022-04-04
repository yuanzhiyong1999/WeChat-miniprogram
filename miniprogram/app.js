// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 配置云开发
    if(!wx.cloud){
      console.error('请使用2.2.3或以上的基础库以使用云能力')
    }else{
      wx.cloud.init({
        env:'cloud1-4ghkdo4ic06f7016',
        traceUser: true,
      })
    }
  },
  globalData: {
    scores:0,
    openid:wx.getStorageSync('openid') || ''
  }
})
