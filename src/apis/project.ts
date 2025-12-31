// 项目列表
export function getProjectList(params: any) {
  return request({
    url: `/novel`,
    method: "get",
    params
  });
}
// 项目详情
export function getProjectDetail(params: any) {
  return request({
    url: `/novel/${params.id}`,
    method: "get"
  });
}
// 创建项目
export function postProject(data: any) {
  return request({
    url: `/novel`,
    method: "post",
    data
  });
}
// 更新项目
export function putProject(data: any) {
  return request({
    url: `/novel`,
    method: "put",
    data
  });
}

// 删除项目
export function deleteProject(params: any) {
  return request({
    url: `/novel/${params.id}`,
    method: "delete",
    params
  });
}