import request from "@/utils/request";
// 获取首页信息
export function getConfig() {
  return request({
    url: `/pc/system/index/config/getDetail`,
    method: "get"
  });
}
// 文件批量上传
export function uploadFile(data: any, progress: Function) {
  return request({
    url: `/file`,
    method: "post",
    data,
    onUploadProgress(progressEvent: any) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progress({ percent: percentCompleted })
    }
  });
}
// 获取视频文件详情
export function getVideoDetail(params: any) {
  return request({
    url: `/file/detail`,
    method: "get",
    params
  });
}