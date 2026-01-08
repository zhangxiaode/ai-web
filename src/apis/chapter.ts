// 项目列表
export function getChapterList(params: any) {
  return request({
    url: `/chapter`,
    method: "get",
    params
  });
}
// 项目详情
export function getChapterDetail(params: any) {
  return request({
    url: `/chapter/${params.id}`,
    method: "get"
  });
}
// 创建项目
export function postChapter(data: any) {
  return request({
    url: `/chapter`,
    method: "post",
    data
  });
}
// 更新项目
export function putChapter(data: any) {
  return request({
    url: `/chapter`,
    method: "put",
    data
  });
}

// 删除项目
export function deleteChapter(params: any) {
  return request({
    url: `/chapter/${params.id}`,
    method: "delete",
    params
  });
}