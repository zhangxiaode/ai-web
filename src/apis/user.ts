// 用户个人信息
export function getUserDetail() {
  return request({
    url: `/user/detail`,
    method: "GET"
  });
}
// 更新用户
export function updateUser(data: any) {
  return request({
    url: `/user`,
    method: "PUT",
	  data
  });
}
// 更新昵称
export function updateNickname(data: any) {
  return request({
    url: `/user/nickname`,
    method: "PUT",
	  data
  });
}
// 更新头像
export function updateAvatar(data: any) {
  return request({
    url: `/user/avatar`,
    method: "PUT",
	  data
  });
}
// app登录
export function login(data: any) {
  return request({
    url: `/login`,
    method: "POST",
	  data
  });
}
// app三方账号登录
export function loginThird(data: any) {
  return request({
    url: `/login/third`,
    method: "POST",
	  data
  });
}
// app退出登录
export function logout() {
  return request({
    url: `/logout`,
    method: "POST"
  });
}
// app获取图形验证码
export function getCaptcha() {
  return request({
    url: `/captcha`,
    method: "GET",
  });
}
// app发送验证码
export function sendCode(data: any) {
  return request({
    url: `/send/code`,
    method: "POST",
	  data
  });
}
// app注册
export function regist(data: any) {
  return request({
    url: `/regist`,
    method: "POST",
	  data
  });
}
// app设置密码
export function settingPassword(data: any) {
  return request({
    url: `/password`,
    method: "POST",
	  data
  });
}
// app绑定手机号
export function bindPhone(data: any) {
  return request({
    url: `/user/phone/bind`,
    method: "POST",
	  data
  });
}
// app更换手机号
export function updatePhone(data: any) {
  return request({
    url: `/user/phone`,
    method: "PUT",
	  data
  });
}