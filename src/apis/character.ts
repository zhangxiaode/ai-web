// 物品列表
export function getCharacterList(params: any) {
  return request({
    url: `/character`,
    method: "get",
    params
  });
}
// 物品详情
export function getCharacterDetail(params: any) {
  return request({
    url: `/character/${params.id}`,
    method: "get",
    params
  });
}

// AI创建物品
export function createCharacter(data: any) {
  return request({
    url: `/character/create`,
    method: "post",
    data
  });
}

// 创建物品
export function postCharacter(data: any) {
  return request({
    url: `/character`,
    method: "post",
    data
  });
}

// 更新物品
export function putCharacter(data: any) {
  return request({
    url: `/character`,
    method: "put",
    data
  });
}

// 删除物品
export function deleteCharacter(params: any) {
  return request({
    url: `/character/${params.id}`,
    method: "delete",
    params
  });
}