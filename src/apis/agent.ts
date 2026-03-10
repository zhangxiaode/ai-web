// 数字人列表
export function getAgentList(params: any) {
  return request({
    url: `/agent`,
    method: "get",
    params
  });
}
// 数字人详情
export function getAgentDetail(params: any) {
  return request({
    url: `/agent/${params.id}`,
    method: "get",
    params
  });
}

// 创建数字人
export function postAgent(data: any) {
  return request({
    url: `/agent`,
    method: "post",
    data
  });
}

// 更新数字人-创建克隆数字人形象
export function createAgent(data: any) {
  return request({
    url: `/agent/create`,
    method: "put",
    data
  });
}

// 更新数字人-生成数字人视频
export function createAgentVideo(data: any) {
  return request({
    url: `/agent/video`,
    method: "put",
    data
  });
}

// 更新数字人
export function putAgent(data: any) {
  return request({
    url: `/agent`,
    method: "put",
    data
  });
}

// 删除数字人
export function deleteAgent(params: any) {
  return request({
    url: `/agent/${params.id}`,
    method: "delete",
    params
  });
}