import request from "@/utils/request";
// 提取音频
export function getVideoAudio(data: any) {
  return request({
    url: `/video_to_audio`,
    method: "post",
    data
  });
}

// 视频剪辑
export function cutVideo(data: any) {
  return request({
    url: `/cut_video`,
    method: "post",
    data
  });
}

// 图片格式转换
export function conversionImageFormat(data: any) {
  return request({
    url: `/conversion_image_format`,
    method: "post",
    data
  });
}

// 音频格式转换
export function conversionAudioFormat(data: any) {
  return request({
    url: `/conversion_audio_format`,
    method: "post",
    data
  });
}

// 视频格式转换
export function conversionVideoFormat(data: any) {
  return request({
    url: `/conversion_video_format`,
    method: "post",
    data
  });
}

// 文件下载
export function downloadFile(params: any) {
  return request({
    url: `/file/download`,
    method: "get",
    params
  });
}