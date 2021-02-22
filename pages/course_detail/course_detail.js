// pages/course_xiang/course_xiang.js
// var total_micro_second = 10000 * 10000;
const app = getApp()
Page({

  // 分享图片的路径
  shareImagePath: '',


  /**
   * 页面的初始数据
   */
  data: {
    // clock: '',
    currentData: 0,
    info: '',
    id: '',
    clientHeight: 500,
    teacherList:[],
    mulu:[],
    isauth: false,

    pass_video_id:'',
    pass_video_time:'',
    isshowbuy:'',
    needBuy:false,
    showCanvas:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      id: options.id,
      naviHeight:wx.getStorageSync('naviHeight')
    })
    this.initscreen()
    this.getTeacher()
  },
  //初始化数据请求目录
  onShow: function () {
    this.setData({ islogin: wx.getStorageSync('islogin') })
    var options = {
      id: this.data.id
    }
    this.initData(options.id)
    // this.setisauth()
    this.submit_video_recod()
    // this.setisshowbuy()
  },
  // setisshowbuy:function(){
  //     this.setData({ isshowbuy: app.globalData.isshowbuy })
  // },
  //提交从上一个页面传来的的视频记录

  getCourse:function(){
    let that = this
   if(!that.data.btn_click){
    that.setData({
      needBuy:true,
      btn_click:true
    })
   }
    
  },
  closeGetCourse:function(){
    let that = this
  
    that.setData({
      needBuy:false,
      btn_click:false
    })
   
    
  },

  //复制老师联系方式
  copy:function(){
    var that = this;
    var tel = that.data.teacherInfo.mobile
    // console.log(tel)
      wx.setClipboardData({
      data: tel,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
          duration:1600
        })
        setTimeout(function () {
          that.closeGetCourse()    //关闭联系老师弹框
        }, 1800)
      }
    });
  },

  submit_video_recod(){
      var that = this
      var params = {
          uid:wx.getStorageSync('uid'),
          id: that.data.pass_video_id,
          duration: that.data.pass_video_time,
          course_id: that.data.id
      }
      // console.log("提交的参数"+ params.uid,params.id, params.duration)
      app.ljjs.video_addinfo(params).then(d=>{
          // if(d.data.code)
          // console.log(d)
          if(d.data.code == 0){
            that.setData({ mulu: d.data.data.mulu })
            that.zhankai()
          }
          
      })
  },
  //
  // setisauth:function() {
  //   var isauth = wx.getStorageSync('isauth')
  //   if (isauth) {
  //     this.setData({ isauth: isauth })
  //   }
  // },
  // 初始化屏幕高度
  initscreen: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ clientHeight: res.windowHeight })
      },
    })
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //跳转去看视频
  gokan_video: function (e) {
    var that = this
   
      var lesson_id = e.currentTarget.dataset.lesson_id
      var id = e.currentTarget.dataset.id
     
      wx.navigateTo({
        url: '/pages/course_video/course_video?lesson_id=' + lesson_id + '&id=' + id,
      })
    
  },

  checkCurrent: function (e) {
    const that = this
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  //初始化详情页数据
  initData: function (system_id) {
    var that = this
    // var token = wx.getStorageSync("token")
    var uid = wx.getStorageSync("uid")
    var params = {
      id: system_id,
      uid: uid?uid:''
    }
    app.ljjs.courseDetail(params).then(d => {
      if (d.data.code == 0) {
        that.dealAva(d.data.data.courseInfo.xcx_avatar)
        d.data.data.courseInfo.price = parseInt(d.data.data.courseInfo.price)
        that.setData({ info: d.data.data.courseInfo, teacherList: d.data.data.teacherList,mulu:d.data.data.mulu })
        // that.count_down(this);
        that.zhankai()
        // that.submit_video_recod()
      } else {
        console.log("详情页数据接口错误")
      }
    })
  },

  //初始化详情页数据
  getTeacher: function (system_id) {
    var that = this
    // var token = wx.getStorageSync("token")
    var uid = wx.getStorageSync("uid")
    var params = {}
    app.ljjs.zlk_tearcher(params).then(d => {
      if (d.data.status == 1) {
        
        that.setData({ teacherInfo: d.data.data })
        // // that.count_down(this);
        // that.zhankai()
        // // that.submit_video_recod()
      } else {
        
      }
    })
  },
  //默认展开
  zhankai: function () {
    var that = this
    var info = that.data.mulu
    if (info) {
      info.forEach(function (item, index) {
        var dd = 'mulu[' + index + '].iszhedie'
        that.setData({ [dd]: true })
      })
    }

  },
  zhedie: function (e) {
    //  console.log(e)
    var index = e.currentTarget.dataset.index
    if (this.data.mulu[index].iszhedie) {
      var dd = 'mulu[' + index + '].iszhedie'
      this.setData({ [dd]: false })
    } else {
      var dd = 'mulu[' + index + '].iszhedie'
      this.setData({ [dd]: true })
    }

  },

  //微信登录
  bindGetUserInfo: function (e) {
    wx.showLoading({
      title: '登录中...',
    })
    var that = this;
    // app.wechat.setStorage('userInfo',e.detail.userInfo);
    // 获取用户信息
    if (e.detail.userInfo) {
      console.log(e);
      app.wechat.setStorage('userInfo', e.detail.userInfo);
      var userInfo = e.detail.userInfo;
      var encryptedData = encodeURIComponent(e.detail.encryptedData);
      var iv = encodeURIComponent(e.detail.iv);
      //var uid = app.wechat.getStorage('uid');
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            app.wechat.setStorageSync('isauth', true);
            app.wechat.login().then(d => {
              //console.log("zheshi"+d.code)
              console.log(d)
              var params = {
                "code": encodeURIComponent(d.code),
                "encryptedData": encryptedData,
                "iv": iv,
                "userinfo": JSON.stringify(userInfo)
              }
              app.ljjs.loginregister(params).then(d => {
                console.log(d)
                app.wechat.setStorage("uid", d.data.data.uid).then(s => {
                  wx.hideLoading()
                  if (d.data.isfirstlogin == 1) {
                    wx.switchTab({ url: '../home/home' })
                  } else {
                    wx.navigateTo({ url: '../in/in' })
                  }
                })
              })

            })

          } else {
            app.wechat.setStorage('isauth', false);
          }

        }
      })

    } else {
      console.log("用户拒绝授权用户信息")
      wx.hideLoading()
    }
  },
  //获取微信绑定手机号
  getPhoneNumber: function (e) {
    var that = this
    //单微信获取测试
    var type = e.currentTarget.dataset.type;
    console.log(type + 'type')
    that.setData({
      type: type
    })
    //单微信获取测试结束
    wx.login({
      success: res => {

        if (e.detail.errMsg == "getPhoneNumber:ok") {
          wx.showLoading({
            title: '登录中...',
          })
          wx.login({
            success(res) {
              // console.log("cccs.code" + res.code)

              let iv = encodeURIComponent(e.detail.iv);
              let encryptedData = encodeURIComponent(e.detail.encryptedData);
              let code = res.code

              var params = {
                "type": "ljjs",
                "code": code,
                "iv": iv,
                "encryptedData": encryptedData
              }
              // console.log(params)
              app.ljjs.login(params).then(d => {
                if (d.data.code == 0) {
                  wx.setStorageSync('uid', d.data.data.uid);
                  wx.setStorageSync("islogin", true)
                    // that.setData({
                    //   // showModal_num: true,
                    //   islogin: true
                    // })
                    that.onShow()
                    
                    wx.hideLoading()
                  
                }       
                else {
                  wx.showToast({
                    title: d.data.msg + '登录失败',
                    icon: 'none',
                    duration: 1000
                  })
                  wx.hideLoading()
                  console.log(d.data.msg)
                }
                
              })
            }
          })  
        }
      }
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
    // let that
    return {
      title: "【课程】" + this.data.info.title,
      // desc: "右上角分享描述",
      imageUrl:this.shareImagePath,
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
  
  },
  // gobuy_page: function () {
  //   var that = this
  //   var miaosha = 0
  //   if (that.data.info.discount_price) {
  //     miaosha = 1
  //   }
  //   var course = {
  //     title: that.data.info.title,
  //     // video_tot: that.data.info.video_tot,
  //     // point_tot: that.data.info.point_tot,
  //     // question_tot: that.data.info.question_tot,
  //     price: that.data.info.price,
  //     // discount_price: that.data.info.discount_price
  //     ptjc: that.data.info.ptjc,
      
  //   }
  //   var dd = JSON.stringify(course)
  //   console.log("dd是"+ dd)
  //   wx.navigateTo({
  //     url: '/pages/course_buy/course_buy?system_id=' + that.data.id + '&miaosha=' + miaosha ,
  //   })
  // },
  // count_down: function (that) {
  //   var newTime = new Date().getTime()
  //   var endTime = that.data.info.discount_end_time * 1000;
  //   that.setData({
  //     clock: that.date_format(endTime)
  //   });


  //   if (newTime - endTime > 0) {
  //     that.setData({ clock: '已经截止' });
  //     return;
  //   }

  //   setTimeout(function () {
  //     //total_micro_second -= 10;
  //     that.count_down(that)
  //     //  console.log("hh")
  //   }, 1000)
  // },

  // date_format: function (endTime) {
  //   var that = this
  //   var newTime = new Date().getTime()
  //   var time = (endTime - newTime) / 1000
  //   let day = parseInt(time / (60 * 60 * 24));
  //   let hou = parseInt(time % (60 * 60 * 24) / 3600);
  //   let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
  //   let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);

  //   var obj = {
  //     day: that.fill_zero_prefix(day),
  //     hou: that.fill_zero_prefix(hou),
  //     min: that.fill_zero_prefix(min),
  //     sec: that.fill_zero_prefix(sec)
  //   }
  //   // return hr + ":" + min + ":" + sec ;
  //   // console.log(obj)
  //   return obj
  // },

  // fill_zero_prefix: function (num) {
  //   return num < 10 ? '0' + num : num
  // }


  // 处理图片
dealAva:function(face){
  let that = this 
    wx.getImageInfo({
      src: face,
      success: function (res) {
        console.log(res,"res");
        var face = res.path
        that.drawShareImage(face)
      }
    })
},

/**
   * 绘制分享图片
  */
 drawShareImage: function (face) {
  this.setData({
    showCanvas: true
  })
  var title1,title2
  if(this.data.info.title.length > 12){
    var title1 = this.data.info.title.substr(0,12)
    var title2 = this.data.info.title.substr(12,12)
    console.log(title1)
    console.log(title2)
  }else{
    var title1 = this.data.info.title
  }
  // var title = "判断推理系统课判断推理系统课判断推理系统课"
  
  const ctx = wx.createCanvasContext('shareCanvas')
  ctx.drawImage(face, 0, 0, 375, 170)
  ctx.drawImage("/images/share_course.png", 0, 131, 375, 170)

  //画昵称
  ctx.restore()
  ctx.beginPath()
  ctx.setFontSize(26)
  ctx.setFillStyle('#272727')
  ctx.font = "bold 26px sans-serif";
  ctx.setTextAlign('center')
  ctx.fillText(title1, 187, 227,300)
  if(title2){
    ctx.fillText(title2 + "...", 187, 255,300)
  }
  ctx.stroke()
  let teacherName = ''
  for(let n=0;n<this.data.teacherList.length;n++){
    teacherName += this.data.teacherList[n].name + ","
  }
  if(teacherName.length > 0){
    teacherName = teacherName.substr(0,teacherName.length - 1);
  }
  console.log(teacherName)

  // var teacherName = this.data.teacherList.name.join(",")
  // console.log(teacherName)
  // if(title2){
  //   ctx.drawImage("/images/num_bg.png", 140, 250, 100, 20)
  // }else{
  //   ctx.drawImage("/images/num_bg.png", 140, 230, 100, 20)
  // }

  ctx.restore()
  ctx.beginPath()
  ctx.setFontSize(16)
  // ctx.setFillStyle('#FFFFFF')
  ctx.setTextAlign('center')
  // ctx.fillText("授课老师：" + teacherName, 180,260,100)
  if(title2){
    ctx.fillText("授课老师：" + teacherName, 180,280,100)
  }else{
    ctx.fillText("授课老师：" + teacherName, 180,260,100)
  }
  ctx.stroke()
  console.log("画图完成")

  let that = this
  ctx.draw(true,function(e) {
    // console.log("开始生成图片地址")
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 375,
      height: 320,
      canvasId: 'shareCanvas',
      success(res) {
        console.log(res.tempFilePath)
        that.shareImagePath = res.tempFilePath
        console.log(that.shareImagePath,"图片地址")
        that.setData({
          showCanvas: false,
          // teacher_info:true
        })
      },
      fail (res) {
        console.log("图片地址生成失败")
        that.setData({
          showCanvas: false,
          // teacher_info:true
        })
      }
    })
  })

},




})