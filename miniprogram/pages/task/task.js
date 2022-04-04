// pages/task/task.js
var app = getApp()
import Notify from '@vant/weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    // 弹出层开关
    popup: false,
    // 遮罩层开关
    overlay: false,
    name: '',
    score:0,
    fileList: []
  },

  // 处理任务点击事件
  eventHandle(e) {
    this.setData({
      popup: true,
      name: e.currentTarget.dataset.name,
      score:e.currentTarget.dataset.score
    })
  },
  onClose() {
    this.setData({
      popup: false
    })
  },
  afterRead(event) {
    // 显示遮罩层
    this.setData({
      popup: false,
      overlay: true
    })
    const {
      file
    } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    let cloudPath = "taskPhoto/" + app.globalData.openid + '-' + Date.now() + ".jpg";
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: file.url, // 文件路径
    }).then(res => {
      // 将图片路径存储在数据库
      const db = wx.cloud.database()
      db.collection('taskPhoto').add({
          data: {
            name: this.data.name,
            score:this.data.score,
            imageUrl: res.fileID,
            status:'待审核',
            submitTime: db.serverDate()
          }
        })
        .then(res1 => {
          // 设置任务状态为待审核
          db.collection('task').where({
              name: this.data.name
            }).update({
              data: {
                status: '待审核',
              }
            })
            .then(res2 => {
              // 去除遮罩层
              this.setData({
                overlay: false
              })
              Notify({
                type: 'success',
                message: '上传成功'
              });
              this.getTaskList()
            })
            .catch(err => {
              // 去除遮罩层
              this.setData({
                overlay: false
              })
              Notify({
                type: 'danger',
                message: '更新任务状态异常'
              });
            })
        })
        .catch(err => {
          // 去除遮罩层
          this.setData({
            overlay: false
          })
          Notify({
            type: 'danger',
            message: '数据库添加异常'
          });
        })
    }).catch(error => {
      // 去除遮罩层
      this.setData({
        overlay: false
      })
      Notify({
        type: 'danger',
        message: '文件上传异常'
      });
    })
  },
  getTaskList() {
    const db = wx.cloud.database()
    // 获取任务数据
    const coll = db.collection("task")
    coll.where({
      status: '未完成'
    }).get({
      success: res => {
        this.setData({
          //将从云端获取的数据放到taskList中
          taskList: res.data,
        })
      },
      fail: console.error
    })
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
    } else {
      this.getTaskList()
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