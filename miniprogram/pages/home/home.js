// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    travelList:[{
      title:'十一',
      tag:'烟台',
      value:'2019.10',
    },
    {
      title:'银杏林',
      tag:'烟台',
      value:'2019.11',
    },
    {
      title:'芝罘岛',
      tag:'烟台',
      value:'2019.12',
    },
    {
      title:'海水浴场',
      tag:'烟台',
      value:'2020.09',
    },
    {
      title:'金沙滩',
      tag:'烟台',
      value:'2020.10',
    },
    {
      title:'台儿庄',
      tag:'枣庄',
      value:'2021.01',
    },
    {
      title:'所城里',
      tag:'烟台',
      value:'2021.03',
    },
    {
      title:'南山公园',
      tag:'烟台',
      value:'2021.04',
    },
    {
      title:'小麦岛',
      tag:'青岛',
      value:'2021.04',
    },
    {
      title:'毕业',
      tag:'烟台',
      value:'2021.05',
    },
    {
      title:'烟台山',
      tag:'烟台',
      value:'2021.05',
    },
    {
      title:'毕业',
      tag:'烟台',
      value:'2021.06',
    },
    {
      title:'故宫',
      tag:'北京',
      value:'2021.06',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    // 获取轮播图数据
    const coll = db.collection("swiper")
    coll.get({
      success:res=>{
        this.setData({
          //将从云端获取的数据放到swiperList中
          swiperList:res.data,
        })
      },
      fail:console.error
    })
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