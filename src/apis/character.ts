// 角色列表
export function getCharacterList(params: any) {
  return request({
    url: `/character`,
    method: "get",
    params
  });
}
// 角色详情
export function getCharacterDetail(params: any) {
  return request({
    url: `/character/${params.id}`,
    method: "get",
    params
  });
}

// AI创建角色
export function createCharacter(data: any) {
  return request({
    url: `/character/create`,
    method: "post",
    data
  });
}

// 创建角色
export function postCharacter(data: any) {
  return request({
    url: `/character`,
    method: "post",
    data
  });
}

// 更新角色
export function putCharacter(data: any) {
  return request({
    url: `/character`,
    method: "put",
    data
  });
}

// 删除角色
export function deleteCharacter(params: any) {
  return request({
    url: `/character/${params.id}`,
    method: "delete",
    params
  });
}