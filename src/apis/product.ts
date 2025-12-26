// 充值产品列表
export function getProductList() {
  return request({
    url: `/product`,
    method: "get"
  });
}
// 充值产品详情
export function getProductDetail(params: any) {
  return request({
    url: `/product/${params.id}`,
    method: "get"
  });
}