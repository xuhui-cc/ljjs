// pages/course/course.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this 
    that.setData({
      naviHeight:wx.getStorageSync('naviHeight')
    })
    
  },

  /**
   * 获取招教课程
   */
  getCourse : function() {
    let that = this 
    let  uid = wx.getStorageSync('uid')
    let  params = {
      fid:2,
      uid: uid ? uid :''
    }
    // console.log(params)
    app.ljjs.get_course_list(params).then(d => {
      if (d.data.code == 0) {
        for(let i=0;i<d.data.data.surplus.length;i++){
          d.data.data.surplus[i].price = parseInt(d.data.data.surplus[i].price)
        }
        that.setData({
          courseList:d.data.data
        })
      }
    })
  },

  //课程详情页跳转
  toCourseDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/course_detail/course_detail?id=' + id,
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
    let that = this
    that.getCourse()
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
    return {
      title: "领军教师课程" ,
      // desc: "右上角分享描述",
      imageUrl:"/images/ljjs_share.png",
      // path: '/page/test_details/test_d?housesid=' + 123,
   
      // success: function (res) {
      //   // 转发成功
      //   console.log("转发成功:" + JSON.stringify(res));
      // },
      // fail: function (res) {
      //   // 转发失败
      //   console.log("转发失败:" + JSON.stringify(res));
      // }
   
  }
}
})