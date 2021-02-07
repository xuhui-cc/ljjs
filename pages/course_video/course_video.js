// pages/kan_video/kan_video.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system_id: '',
    lesson_id: '',
    pinglun: [],
    videoUrl: '',
    isufll:false,
    videoimage: "block",
    start_time:'',
    end_time:'',
    main_id:'',
    duan:''
  },

  bindplay: function (e) {
    this.setData({
      tab_image: "none"
    }),
    this.videoCtx.play();
  },

  //获取开始时间戳
  getstarttime(){
    var timestamp = Date.parse(new Date());
    return timestamp = timestamp / 1000;
  },
  //获取结束时间戳
  getendtime(){
    var timestamp = Date.parse(new Date());
    return timestamp = timestamp / 1000;
  },

  //给上一个页面传值
  setprepagedata(main_id,video_time){
    let pages = getCurrentPages();
    let currPage = null; //当前页面
    let prevPage = null; //上一个页面

    if (pages.length >= 2) {
      currPage = pages[pages.length - 1]; //当前页面
      prevPage = pages[pages.length - 2]; //上一个页面
    }
    if (prevPage) {
      prevPage.setData({
        pass_video_id: main_id,
        pass_video_time: video_time
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var uid = wx.getStorageSync('uid');
    var params = {
      "uid": uid,
      "video_id": options.lesson_id,
      "id": options.id
    }
    that.setData({main_id:options.id})
    // console.log(params)
    app.ljjs.video_info(params).then(d => {
      if (d.data.code == 0) {
        that.setData({videoUrl: d.data.data.videoUrl,duan:d.data.data.currenttime})
        wx.createVideoContext('11').seek(parseInt(d.data.data.currenttime))
        // wx.createVideoContext('11').seek(10)
        console.log("开始播放时间" + d.data.data.currenttime)
      } else {
        // console.log(d.data.msg)
      }
    })
    // console.log(this.data.videoUrl)
  },

  //视频进入、退出全屏
  fullScreen(e){
    var that = this
    var isFull = e.detail.fullScreen
    this.setData({isfull:isFull})
    if(!isFull){
      //  var st = that.data.start_time
      //  var en = that.getendtime()
      //  var duan = en - st
      //  that.setprepagedata(that.data.main_id,that.data.duan)
      //  console.log("退出全屏的时间端是" + duan )
       wx.navigateBack({
          delta:1
       }) 
    }else{
      // var st = that.getstarttime()
      // that.setData({start_time: st})
      // console.log("进入全屏 此时的开始时间是" + st)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.videoCtx = wx.createVideoContext('11')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.createVideoContext('11').requestFullScreen()
    
    // var st = that.getstarttime()
    // that.setData({ start_time: st })

  },

  //视频快进时
  updatatime:function(e){
    //  console.log(e)
     this.setData({duan:e.detail.currentTime})
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
    var that = this
    // var st = that.data.start_time
    // var en = that.getendtime()
    // var duan = en - st
    // that.setprepagedata(that.data.main_id, duan)
    that.setprepagedata(that.data.main_id, that.data.duan)
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

  },
})