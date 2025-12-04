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
      console.log(111111, progressEvent)
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(222222, percentCompleted)
      progress({ percent: percentCompleted })
    }
  });
}