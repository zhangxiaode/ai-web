// 订单列表
export function getOrderList(params: any) {
  return request({
    url: `/order`,
    method: "get",
    params
  });
}
// 订单详情
export function getOrderDetail(params: any) {
  return request({
    url: `/order/${params.id}`,
    method: "get"
  });
}
// 创建订单
export function postOrder(data: any) {
  return request({
    url: `/order`,
    method: "post",
    data
  });
}