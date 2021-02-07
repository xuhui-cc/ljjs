// component/naviBar/naviBar.js
const app = getApp()
Component({

  
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value:1
    },
    title: {
      type: String,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0
  },

  attached: function () {
    
    // 定义导航栏的高度   方便对齐
    
    this.getSystemSize()
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getSystemSize:function(){
      let that = this
      let systemInfo = wx.getSystemInfoSync()
      let menuButtonRect = wx.getMenuButtonBoundingClientRect()
      let naviHeight = menuButtonRect.bottom +10
      let statusBarHeight = systemInfo.statusBarHeight
      let naviContentHeight = naviHeight - statusBarHeight
      wx.setStorageSync('naviHeight', naviHeight)
      that.setData({
        naviHeight: naviHeight,
        statusBarHeight: statusBarHeight,
        naviContentHeight: naviContentHeight,
        screenWidth: systemInfo.screenWidth
      })
    },

    backItemClicked: function() {
      wx.navigateBack({
        delta: 0,
      })
    } 
    
  },

  


})
