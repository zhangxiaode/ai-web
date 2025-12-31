// 物品列表
export function getSceneList(params: any) {
  return request({
    url: `/scene`,
    method: "get",
    params
  });
}
// 物品详情
export function getSceneDetail(params: any) {
  return request({
    url: `/scene/${params.id}`,
    method: "get",
    params
  });
}

// AI创建物品
export function createScene(data: any) {
  return request({
    url: `/scene/create`,
    method: "post",
    data
  });
}

// 创建物品
export function postScene(data: any) {
  return request({
    url: `/scene`,
    method: "post",
    data
  });
}

// 更新物品
export function putScene(data: any) {
  return request({
    url: `/scene`,
    method: "put",
    data
  });
}

// 删除物品
export function deleteScene(params: any) {
  return request({
    url: `/scene/${params.id}`,
    method: "delete",
    params
  });
}