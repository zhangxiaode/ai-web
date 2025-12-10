import request from "@/utils/request";
// 获取首页信息
export function getConfig() {
  return request({
    url: `/pc/system/index/config/getDetail`,
    method: "get"
  });
}
// 上传本地文件到OBS
export function uploadFileToOBS(data: any, progress: Function) {
  return request({
    url: `/obs/upload`,
    method: "post",
    data,
    onUploadProgress(progressEvent: any) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progress({ percent: percentCompleted })
    }
  });
}
// 网络文件转存obs
export function uploadNetworkFileToOBS(data: any, progress: Function) {
  return request({
    url: `/obs/upload/network`,
    method: "post",
    data,
    onUploadProgress(progressEvent: any) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      progress({ percent: percentCompleted })
    }
  });
}
// 删除OBS文件
export function deleteObsFile(data: any) {
  return request({
    url: `/obs/${data.key}`,
    method: "delete",
    data
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