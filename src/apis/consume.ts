// 消费列表
export function getConsumeList(params: any) {
  return request({
    url: `/consume`,
    method: "get",
    params
  });
}
// 消费详情
export function getConsumeDetail(params: any) {
  return request({
    url: `/consume/${params.id}`,
    method: "get"
  });
}