import request from "@/utils/request";
// 获取首页信息
export function getConfig() {
  return request({
    url: `/pc/system/index/config/getDetail`,
    method: "get"
  });
}
// 新增创作者
export function addCreator(data: any) {
  return request({
    url: `/pc/system/creator/add`,
    method: "post",
    data,
  });
}