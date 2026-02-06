// 镜头列表
export function getShotList(params: any) {
  return request({
    url: `/chapter/shot`,
    method: "get",
    params
  });
}
// 镜头详情
export function getShotDetail(params: any) {
  return request({
    url: `/chapter/shot/${params.id}`,
    method: "get"
  });
}
// 创建镜头
export function postShot(data: any) {
  return request({
    url: `/chapter/shot`,
    method: "post",
    data
  });
}
// 更新镜头
export function putShot(data: any) {
  return request({
    url: `/chapter/shot`,
    method: "put",
    data
  });
}

// 删除镜头
export function deleteShot(params: any) {
  return request({
    url: `/chapter/shot/${params.id}`,
    method: "delete",
    params
  });
}
