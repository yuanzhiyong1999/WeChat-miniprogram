// pages/manage/manage.js
import Notify from '@vant/weapp/notify/notify';
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewList: [],
  },
  // 图片放大预览
  imagePreview(e) {
    let urls = this.data.reviewList.map(item => {
      return item.imageUrl;
   })
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls:urls
    })
  },
  // 审核通过
  pass(e) {
    const db = wx.cloud.database()
    const _ = db.command
    // 更新任务状态
    db.collection('taskPhoto').where({
        name: e.currentTarget.dataset.name
      }).update({
        data: {
          status: '已完成',
        }
      })
      .then(res => {
        db.collection('user').where({
            _openid: e.currentTarget.dataset.openid
          }).update({
            data: {
              scores: _.inc(e.currentTarget.dataset.score*10)
            }
          })
          .then(res1 => {
            Notify({
              type: 'success',
              message: '审核通过',
              duration: 500,
            });
            this.getReviewList()
          })
          .catch(err1=>{
            Notify({
              type: 'danger',
              message: '审核异常',
              duration: 500,
            });
          })
      })
      .catch(err => {
        Notify({
          type: 'danger',
          message: '审核更新异常',
          duration: 500,
        });
      })
  },
  // 驳回
  back(e) {
    const db = wx.cloud.database()
    // 更新任务状态
    db.collection('task').where({
        name: e.currentTarget.dataset.name
      }).update({
        data: {
          status: '未完成',
        }
      })
      .then(res => {
        // 将审核中的该条记录删除
        db.collection('taskPhoto').doc(e.currentTarget.dataset.id).remove({
        })
        .then(res1=>{
          this.getReviewList()
          Notify({
            type: 'success',
            message: '已驳回',
            duration: 500,
          });
        })
        .catch(err1=>{
          Notify({
            type: 'danger',
            message: '驳回异常',
            duration: 500,
          });
        })
      })
      .catch(err => {
        Notify({
          type: 'danger',
          message: '审核更新异常',
          duration: 500,
        });
      })
  },
  getReviewList() {
    const db = wx.cloud.database()
    // 获取任务数据
    const coll = db.collection("taskPhoto")
    coll.where({
      status: '待审核'
    }).get({
      success: res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].submitTime = res.data[i].submitTime.toLocaleDateString();
        }
        this.setData({
          //将从云端获取的数据放到reviewList中
          reviewList: res.data,
        })
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewList()
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