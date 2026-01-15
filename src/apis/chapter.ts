// 章节列表
export function getChapterList(params: any) {
  return request({
    url: `/chapter`,
    method: "get",
    params
  });
}
// 章节详情
export function getChapterDetail(params: any) {
  return request({
    url: `/chapter/${params.id}`,
    method: "get"
  });
}
// 创建章节
export function postChapter(data: any) {
  return request({
    url: `/chapter`,
    method: "post",
    data
  });
}
// 更新章节
export function putChapter(data: any) {
  return request({
    url: `/chapter`,
    method: "put",
    data
  });
}

// 删除章节
export function deleteChapter(params: any) {
  return request({
    url: `/chapter/${params.id}`,
    method: "delete",
    params
  });
}

// 章节语言详情
export function getChapterLanguageDetail(params: any) {
  return request({
    url: `/chapter/language/${params.id}`,
    method: "get"
  });
}

// 生成剧本
export function postScript(data: any) {
  return request({
    url: `/chapter/script`,
    method: "post",
    data
  });
}

// 创建/更新章节语言
export function postChapterLanguage(data: any) {
  return request({
    url: `/chapter/language`,
    method: "post",
    data
  });
}