// index.js
var app = getApp()
import Notify from '@vant/weapp/notify/notify';
Page({
  data: {
    motto: '当前积分为：',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    canIUseOpenData: false,
    openid: '',
    scores: 0
  },

  // 点击头像跳转到日志
  bindViewTap() {
    if(app.globalData.openid=='oPlOl5J2Di6Z4rHotdAzX7rwy4H4'){
      wx.navigateTo({
        url: '/pages/manage/manage'
      })
    }else{
      wx.navigateTo({
        url: '../logs/logs'
      })
    }
    
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
        openid: wx.getStorageSync('openid') || '',
        userInfo: wx.getStorageSync('userinfo') || null
      })
      app.globalData.openid = this.data.openid
      if (this.data.userInfo != null) {
        this.setData({
          hasUserInfo: true
        })
      }
    }
  },
  onShow() {
    if (this.data.hasUserInfo) {
      // 查询用户积分
      const db = wx.cloud.database()
      db.collection('user').where({
          _openid: this.data.openid
        }).get()
        .then(res => {
            this.setData({
              scores: res.data[0].scores
            })
            app.globalData.scores = res.data[0].scores
        })
        .catch(err => {
          Notify({
            type: 'danger',
            message: '积分查询异常'
          });
        })
    }
  },

  addUser() {
    const db = wx.cloud.database()
    db.collection('user').add({
        data: {
          scores: 0,
          changeTime: db.serverDate()
        }
      })
      .catch(err => {
        Notify({
          type: 'danger',
          message: '数据库添加异常'
        });
      })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userinfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.login({
          success: (res) => {
            if (res.code) {
              //发起网络请求 请求openid session_key
              wx.cloud.callFunction({
                name: 'login',
                success: res => {
                  // 存储用户openid
                  wx.setStorageSync('openid', res.result.openid)
                  app.globalData.openid = res.result.openid
                  this.setData({
                    openid: res.result.openid
                  })
                  // 查询数据库 是否有当前用户
                  const db = wx.cloud.database()
                  db.collection('user').where({
                      _openid: res.result.openid
                    }).get()
                    .then(res => {
                      // 数据库中没有用户数据 说明没有登录过
                      if (res.data.length == 0) {
                        this.addUser()
                      } else {
                        this.setData({
                          scores: res.data[0].scores
                        })
                        app.globalData.scores = res.data[0].scores
                      }
                    })
                    .catch(err => {
                      Notify({
                        type: 'danger',
                        message: '数据库查询异常'
                      });
                    })
                },
                fail: err => {
                  Notify({
                    type: 'danger',
                    message: '云函数调用失败'
                  });
                }
              })
            } else {
              Notify({
                type: 'danger',
                message: '登录失败'
              });
            }
          }
        })
      }
    })
  },

})