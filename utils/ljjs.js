 const fetch = require('./fetch')

const URI = 'http://jztest.lingjun.net/Home/api/'    //测试接口
// const URI = 'https://jz.lingjun.net/Home/api/'    //正式接口

//const URI = 'http://li.jiaozi.cn/Home/api/'    //本地接口
 

//登录
function login(params) {
  return fetch.ljjsfetch(URI, 'applet_login', params,"登录")
}
//获取资料
function getZiliao(params) {
  return fetch.ljjsfetch(URI, 'getZiliao', params)
}
//获取资料
function addKaochang(params) {
  return fetch.ljjsfetch(URI, 'addKaochang', params)
}
//获取课程
function get_course_list(params) {
  return fetch.ljjsfetch(URI, 'course_lists', params,"获取课程")
}
//课程详情
function courseDetail(params) {
  return fetch.ljjsfetch(URI, 'course_details', params,'课程详情')
}
//添加观看视频记录
function video_addinfo(params) {
  return fetch.ljjsfetch(URI, 'video_addinfo', params)
}
//观看视频接口
function video_info(params) {
  return fetch.ljjsfetch(URI, 'video_info', params)
}
//咨询老师信息
function zlk_tearcher(params) {
  return fetch.ljjsfetch(URI, 'zlk_tearcher', params)
}


module.exports = { login, getZiliao, addKaochang ,get_course_list,courseDetail,video_addinfo,video_info,zlk_tearcher}