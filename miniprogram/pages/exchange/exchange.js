// pages/exchange/exchange.js
import Dialog from '@vant/weapp/dialog/dialog';
import Notify from '@vant/weapp/notify/notify';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangeList: [{
        id: 1,
        name: '包包',
        score: 8000,
        icon: '../../images/exchange/bag.png'
      },
      {
        id: 2,
        name: '腮红',
        score: 5000,
        icon: '../../images/exchange/blush.png'
      },
      {
        id: 3,
        name: '蛋糕',
        score: 1000,
        icon: '../../images/exchange/cake.png'
      },
      {
        id: 4,
        name: '精华液',
        score: 6000,
        icon: '../../images/exchange/essence.png'
      },
      {
        id: 5,
        name: '眼影',
        score: 5000,
        icon: '../../images/exchange/eye_shadow.png'
      },
      {
        id: 6,
        name: '粉底',
        score: 5000,
        icon: '../../images/exchange/foundation.png'
      },
      {
        id: 7,
        name: '口红',
        score: 5000,
        icon: '../../images/exchange/lipstick.png'
      },
      {
        id: 8,
        name: '奶茶',
        score: 600,
        icon: '../../images/exchange/milk_tea.png'
      },
      {
        id: 9,
        name: '身体乳',
        score: 1500,
        icon: '../../images/exchange/body_lotion.png'
      },
    ],
    //遮罩层
    show: false
  },
  click(e) {
    var name = e.currentTarget.dataset.name
    var score = e.currentTarget.dataset.score
    Dialog.confirm({
        title: '提示',
        message: '确认使用' + score + '积分兑换' + name + '吗？',
      })
      .then(() => {
        console.log(app.globalData.scores)
        console.log(app.globalData.openid)
        // 点击之后获取积分
        const db = wx.cloud.database()
        // 重新获取积分数据
        db.collection('user').where({
            _openid: app.globalData.openid
          }).get()
          .then(res => {
            // 获取积分成功之后 进行判断积分是否足够 如果足够 就从数据库扣除积分
            if (res.data[0].scores >= score) {
              // 遮罩层
              this.setData({
                show: true
              })
              // 从数据库扣除积分
              db.collection('user').where({
                  _openid: app.globalData.openid
                }).update({
                  data: {
                    scores: res.data[0].scores - score
                  }
                })
                .then(res1 => {
                  // 扣除积分成功之后 增加兑换记录
                  // 增加兑换记录
                  db.collection('exchange').add({
                      data: {
                        name: name,
                        score: score,
                        changeTime: db.serverDate()
                      }
                    })
                    .then(res2 => {
                      // 遮罩层
                      this.setData({
                        show: false
                      })
                      // 更新全局变量
                      app.globalData.scores = res.data[0].scores - score
                      // 增加记录成功后显示提示
                      Notify({
                        type: 'success',
                        message: '兑换成功',
                        duration: 1000
                      });
                    })
                    .catch(err2 => {
                      Notify({
                        type: 'danger',
                        message: '数据库添加异常'
                      });
                    })
                })
                .catch(err1 => {
                  Notify({
                    type: 'danger',
                    message: '数据库更新异常'
                  });
                })
            } else {
              Notify({
                type: 'danger',
                message: '积分不够，继续努力',
                duration: 1000
              });
            }
          })
          .catch(err => {
            Notify({
              type: 'danger',
              message: '数据库查询异常'
            });
          })
      })
      .catch(() => {
        Notify({
          type: 'warning',
          message: '点取消就兑换不了啦',
          duration: 1000
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if ((wx.getStorageSync('userinfo') || null) == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          }, 2000);
        }
      });

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})