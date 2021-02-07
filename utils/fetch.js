/*
*api    根地址
*path   请求路径
*params 请求参数
*return 返回任务的Promise
*/

function ljjsfetch(api, path, params,log,showToast) {
  if (log) {
    console.log(log, '\n', path, "\n参数：\n", params)
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}${path}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success (res) {
        if (showToast) {
          wx.hideLoading({
            success: (res) => {},
          })
        }
        if (log) {
          console.log(log, "\n返回数据：\n", res)
        }
        let code = res.data.code*1
        switch(code){
          case 0: {
            // 请求成功
            resolve(res)
            break
          }
          // case 7:{
          //   // 错误 需要弹自定义窗口
          //   resolve(res)
          //   break
          // }
          case 1: {
            // 参数不合法
          }
          case 2: {
            // 无效请求方式
          }
          case 5: {
            // 数据查询返回空数据组
            resolve(res)
            // if (showToast) {
            //   wx.showToast({
            //     title: res.data.msg ? res.data.msg : "暂无数据",
            //     icon: 'none'
            //   })
            // }
            break
          }
          // case 20: {
          //   // token过期
          //   let login = wx.getStorageSync('login')
          //   if (login) {
          //     let gid = wx.getStorageSync('gid')
          //     wx.clearStorageSync()
          //     wx.setStorageSync('gid', gid)
          //     wx.reLaunch({
          //       url: pagePath.getPagePath('first_page'),
          //     })
          //     wx.showToast({
          //       title: '登录已失效，请重新登录',
          //       icon: 'none'
          //     })
          //   }
          //   break
          // }
          default: {
            resolve(res)
            if (showToast) {
              wx.showToast({
                title: res.data.msg ? res.data.msg : '数据有误',
                icon: 'none',
                duration:3000
              })
            }
          }
        }
      },
      // success: resolve,
      fail: reject
    })
  })
}

function ljjsfetchpost(api, path, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}${path}`,
      data: Object.assign({}, params),
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: resolve,
      fail: reject
    })
  })
}


module.exports = { ljjsfetch, ljjsfetchpost }