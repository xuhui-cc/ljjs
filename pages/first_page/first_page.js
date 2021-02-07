//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showModal_num: false,     //考场蒙层
    islogin: false,        //是否登录
    input_kc: false,    //考场初始判断
    kemu_fill:0,        //是否填写过缓存
    isxd: false,
    isxk: false,
    xd_content: "   请选择",
    xk_content: "   请选择",
    select: [
      { xd: '高中', xk: ["语文", "数学", "英语", "科学", "音乐", "体育", "美术", "心里健康", "信息技术", "思想政治", "历史", "地理", "物理", "生物", "设会", "计算机", "化学", "通用技术", "日语", "俄语"] },
      { xd: '初中', xk: ["语文", "数学", "英语", "科学", "音乐", "体育", "美术", "心里健康", "信息技术", "思想政治", "历史", "地理", "物理", "生物", "设会", "计算机", "化学", "通用技术", "日语", "俄语"] },
      { xd: '小学', xk: ["语文", "数学", "英语", "科学", "体育", "音乐", "美术", "心里健康", "信息技术", "思想政治", "设会", "计算机", "通用技术"] },
      { xd: '幼儿园', xk: ["幼儿"] }
    ],
    zl:[],
    windowheight: (wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth))+237
    
  },
  //事件处理函数

  onLoad: function () {
    
  },

  xl_select:function(e){
    var btn = e.currentTarget.dataset.btn
    console.log(btn + "=================btn_xl")
    if(btn == 1){
      this.setData({ isxd: !this.data.isxd })
    } else if(btn == 2) {
      this.setData({ isxk: !this.data.isxk })
    }
  },

  select:function(e){
    let that = this
    
    
    var btn = e.currentTarget.dataset.btn
    console.log(btn + "=================btn_xl")
    
    if (btn == 1) {
      console.log(that.data.kcid)
      var select_content = e.currentTarget.dataset.select
      console.log(select_content + "=================select_content_xl")
      var index = e.currentTarget.dataset.index
      that.setData({ index: index, xk_content: "请选择" })
      console.log(index + "=================btn_index")
      console.log()
      that.setData({ xd_content: select_content, isxd: false })
      if (that.data.kcid){
        if ((that.data.xd_content.indexOf('请选择') >= 0) || (that.data.xk_content.indexOf('请选择') >= 0)) {
          // if (that.data.xk_content.indexOf('请选择') >= 0) {
          that.setData({
            input_kc: false
          })
        }
        // }
        else {
          that.setData({
            input_kc: true
          })
        }
      }
    } else if (btn == 2) {
      console.log(that.data.kcid)
      var select_content = e.currentTarget.dataset.select
      console.log(select_content + "=================select_content_xl")
      that.setData({ xk_content: select_content, isxk: false })
      if (that.data.kcid) {
        if ((that.data.xd_content.indexOf('请选择') >= 0) || (that.data.xk_content.indexOf('请选择') >= 0)) {
          // if (that.data.xk_content.indexOf('请选择') >= 0) {
            that.setData({
              input_kc: false
            })
          }
        // }
        else {
          that.setData({
            input_kc: true
          })
        }
      }
    }
    else{
      that.setData({
        input_kc: true
      })
    }
  },

  onShow: function () {
    let that = this
    that.setData({
      islogin: wx.getStorageSync("islogin")
    })
    if (wx.getStorageSync("kemu_fill")){
      that.setData({
        kemu_fill: wx.getStorageSync("kemu_fill"),
        kc_yes:true
      })
    }
  },



  input: function (e) {
    let that = this 
    console.log(e.detail.value)
    var regkcid = new RegExp('[0-9]', 'g');
    var iskcid = regkcid.exec(e.detail.value);
    if (iskcid) {
      console.log(e.detail.value.length)
      if (e.detail.value.length == 4){
        if (e.detail.value >= 1) {
          if (1 <= e.detail.value && e.detail.value <= 840) {
            that.setData({
              kcid: e.detail.value
            })
            console.log(that.data.xd_content + that.data.xk_content)
            if ((that.data.xd_content.indexOf('请选择') >= 0) || (that.data.xk_content.indexOf('请选择') >= 0)) {
              // if (that.data.xk_content.indexOf('请选择') >= 0) {
              that.setData({
                input_kc: false
              })
            }
            // }
            else {
              that.setData({
                input_kc: true
              })
            }
          }
          else {
            wx.showToast({
              title: "请输入正确的关键字",
              icon: 'none',
              duration: 500
            })
            that.setData({
              input_kc: false
            })
          }
        } else {
          wx.showToast({
            title: "请输入正确的关键字",
            icon: 'none',
            duration: 500
          })
          that.setData({
            input_kc: false
          })
        }
      }else{
        wx.showToast({
          title: "请输入正确的关键字",
          icon: 'none',
          duration: 1000
        })
        that.setData({
          kcid: "",
          input_kc: false
        })

      }

    }
    else {
      wx.showToast({
        title: "请输入正确的关键字",
        icon: 'none',
        duration: 1000
      })
      that.setData({
        kcid: "",
        input_kc: false
      })
    }
    console.log(that.data.kcid + 'kcid')
  },
  
  
  //考场提交
  kc_submit: function () {
    let that = this
    var uid = wx.getStorageSync("uid")
    console.log(uid)
    var params = {
      uid: uid,
      kcid: that.data.kcid,
      xueduan: that.data.xd_content,
      xueke: that.data.xk_content
    }
    console.log(params)
    app.ljjs.addKaochang(params).then(d => {
      if (d.data.status == 1) {
        console.log(d.data.msg + 'msg,addkc')
        that.setData({ kc_yes : true})
        // 提交后增加存缓存、
        wx.setStorageSync('kemu_fill', 1)
        var params = {
          xueduan: that.data.xd_content,
          xueke: that.data.xk_content
        }
        app.ljjs.getZiliao(params).then(r => {
          if (r.data.status == 1) {
            that.setData({zl : r.data.data})
            console.log(r.data.msg + 'msg,getzl')
            let onopen = false;

            // let opening = 
            that.setData({
              opening:true
            })
            that.open_file(that.data.type,onopen)
          //   if (that.data.type == 1 || that.data.type == 4 || that.data.type == 5 || that.data.type == 6 || that.data.type == 7){
          //     for(let i = 0; i < that.data.zl.length; i ++){
          //       if (that.data.zl[i].type == that.data.type){
          //         console.log("准备打开")
          //         wx.showLoading({
          //           title: '资料开启中...',
          //         })
          //         onopen = true;
          //         wx.downloadFile({
          //           url: that.data.zl[i].fileurl, //仅为示例，并非真实的资源
          //           success(res) {
          //             // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          //             var filePath = res.tempFilePath
          //             wx.openDocument({
          //               filePath: filePath,
          //               success: function (res) {
          //                 console.log('打开文档成功')
          //                 wx.hideLoading()
          //               }
          //             })
          //           }
          //         })
          //       }
          //     }
          //   }
          //   else if (that.data.type == 2){
          //     for (let i = 0; i < that.data.zl.length; i++) {
          //       if (that.data.zl[i].type == 2) {
          //         console.log("准备打开")
          //         wx.showLoading({
          //           title: '资料开启中...',
          //         })
          //         onopen = true;
          //         wx.downloadFile({
          //           url: that.data.zl[i].fileurl, //仅为示例，并非真实的资源
          //           success(res) {
          //             // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          //             var filePath = res.tempFilePath
          //             wx.openDocument({
          //               filePath: filePath,
          //               success: function (res) {
          //                 console.log('打开文档成功')
          //                 wx.hideLoading()
          //               }
          //             })
          //           }
          //         })
          //       }
                 
          //     }
          //   }
          //   else if (that.data.type == 3){
          //     for (let i = 0; i < that.data.zl.length; i++) {
          //       if (that.data.zl[i].type == 3) {
          //         onopen = true;
          //         console.log("准备video")
          //         wx.navigateTo({
          //           url: '/pages/video/video?url=' + that.data.zl[i].fileurl
          //         })
          //       }
                
          //     }              
          //   }
          // else {
          //   console.log(that.data.type  +  '打开失败')
          // }
          // if (!onopen) {
          //   wx.showToast({
          //     title: '资料还没有上传哦~',
          //     icon: 'none',
          //     duration: 1500
          //   })
          // }
        }
        else {
          // console.log()
          wx.showToast({
            title: r.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
        that.setData({
          showModal_num: false
        })
      }
      else {
        console.log(d.data.msg + '失败')
      }
    }) 
  },
  //考场选择蒙层判断
  showModal_num: function (e) {
    let that = this
    var type = e.currentTarget.dataset.type;
    let onopen = false;
    console.log(type + 'type')
    that.setData({
      type: type
    })
    if (that.data.kc_yes) {
      if(that.data.zl != ''){
        that.setData({
          opening:true
        })
        that.open_file(type,onopen)
      }else{
        var params = {
          xueduan: that.data.xd_content,
          xueke: that.data.xk_content
        }
        app.ljjs.getZiliao(params).then(r => {
          if (r.data.status == 1) {
            that.setData({ zl: r.data.data })
            console.log(r.data.msg + 'msg,getzl')
            that.setData({
              opening:true
            })
            that.open_file(type,onopen)
  
            
          }
          else {
            console.log(r.data.msg)
            wx.showToast({
              title: '还没有资料哦',
              icon: 'none',
              duration: 1500
            })
          }
        })
      }
      
     
    }
    else {
      that.setData({
        showModal_num: true
      })
    }

  },

  modifyFileName:function(zl_file){
    let that = this
    wx.showLoading({
      title: '资料开启中...',
    })
    var fileName = zl_file.title + ".pdf" 
    that.setData({
      fileName: fileName
    })
    let customFilePath = wx.env.USER_DATA_PATH + "/" + that.data.fileName
    console.log('得到自定义路径：')
    console.log(customFilePath)


    wx.downloadFile({
      url: zl_file.fileurl, //仅为示例，并非真实的资源
      filePath: customFilePath,
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

        console.log(res)
        var filePath = res.filePath
        console.log('返回自定义路径：')
        console.log(filePath)
        that.setData({
          opening:false
        })
        that.openFilePath = filePath
        wx.openDocument({
          showMenu: true,
          filePath: filePath,
          success: function (res) {
            // console.log('打开文档成功')
            wx.hideLoading()
          },
          fail: function (res) {
            console.log("打开文档失败");
            console.log(res)
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '文件打开失败',
                  icon: 'none'
                })
              },
            })
          },
          // complete: function (res) {
          //   console.log("complete");
          //   console.log(res)
          // }
        })
      },
      fail: function (res) {
        that.setData({
          opening:false
        })
        console.log('文件下载失败')
        console.log(res)
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '文件下载失败',
              icon: 'none'
            })
          },
        })
      }
    })
  },

  open_file:function(type,onopen){
    let that = this
   
    if (that.data.type == 1 || that.data.type == 4 || that.data.type == 5 || that.data.type == 6 || that.data.type == 7) {
      for (let i = 0; i < that.data.zl.length; i++) {
        if (that.data.zl[i].type == type) {
          onopen = true
          console.log("准备打开")
          that.modifyFileName(that.data.zl[i])
        }
      }
    }
    else if (that.data.type == 2) {
      for (let i = 0; i < that.data.zl.length; i++) {
        if (that.data.zl[i].type == 2) {
          console.log("准备打开")
          that.modifyFileName(that.data.zl[i])
          // wx.showLoading({
          //   title: '资料开启中...',
          // })

          // // var suffix = that.data.zl[i].fileurl
          // // + that.data.zl[i].suffix
          // var fileName = that.data.zl[i].title + ".pdf" 
          // that.setData({
          //   fileName: fileName
          // })
          // let customFilePath = wx.env.USER_DATA_PATH + "/" + that.data.fileName
          // console.log('得到自定义路径：')
          // console.log(customFilePath)


          // wx.downloadFile({
          //   url: that.data.zl[i].fileurl, //仅为示例，并非真实的资源
          //   filePath: customFilePath,
          //   success(res) {
          //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    
          //     console.log(res)
          //     var filePath = res.filePath
          //     console.log('返回自定义路径：')
          //     console.log(filePath)
    
          //     that.openFilePath = filePath
          //     wx.openDocument({
          //       showMenu: true,
          //       filePath: filePath,
          //       success: function (res) {
          //         console.log('打开文档成功')
          //         wx.hideLoading()
          //       },
          //       fail: function (res) {
          //         console.log("打开文档失败");
          //         console.log(res)
          //         wx.hideLoading({
          //           complete: (res) => {
          //             wx.showToast({
          //               title: '文件打开失败',
          //               icon: 'none'
          //             })
          //           },
          //         })
          //       },
          //       complete: function (res) {
          //         console.log("complete");
          //         console.log(res)
          //       }
          //     })
          //   },
          //   fail: function (res) {
          //     console.log('文件下载失败')
          //     console.log(res)
          //     wx.hideLoading({
          //       complete: (res) => {
          //         wx.showToast({
          //           title: '文件下载失败',
          //           icon: 'none'
          //         })
          //       },
          //     })
    
          //   }
          // })
        }
        else if (that.data.zl[i].type == 1 || that.data.zl[i].type == 3) {

        } else {
          wx.showToast({
            title: '资料还没有上传哦~',
            icon: 'none',
            duration: 1500
          })
        }
      }
    }
    else if (that.data.type == 3) {
      for (let i = 0; i < that.data.zl.length; i++) {
        if (that.data.zl[i].type == 3) {
          console.log("准备video")
          wx.navigateTo({
            url: '/pages/video/video?url=' + that.data.zl[i].fileurl
          })

        }
        else if (that.data.zl[i].type == 2 || that.data.zl[i].type == 1) {

        } else {
          wx.showToast({
            title: '资料还没有上传哦~',
            icon: 'none',
            duration: 1500
          })
        }

      }

    }
    else {
      console.log(that.data.type + '打开失败')
    }
    if(!onopen){
      wx.showToast({
        title: '资料还没有上传哦~',
        icon: 'none',
        duration: 1500
      })
    }
  },
  //考场蒙层关闭按钮
  del_num: function () {
    this.setData({
      showModal_num: false,
      input_kc: false,    //考场初始判断
      isxd: false,
      isxk: false,
    })
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
              console.log(params)
              app.ljjs.login(params).then(d => {
                if (d.data.code == 0) {
                  wx.setStorageSync('uid', d.data.data.uid);
                  
                    that.setData({
                      showModal_num: true,
                      islogin: true
                    })
                    wx.setStorageSync("islogin", that.data.islogin)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "领军教师资料" ,
     
      imageUrl:"/images/ljjs_share.png",
      // path: '/page/test_details/test_d?housesid=' + 123,
   
      
  }
}


  
})
