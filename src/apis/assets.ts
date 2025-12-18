// 音色列表
export function getVoiceList(params: any) {
  return request({
    url: `/voice`,
    method: "get",
    params
  });
}
// 音色详情
export function getVoiceDetail(params: any) {
  return request({
    url: `/voice/${params.id}`,
    method: "get",
    params
  });
}

// 创建三方已有音色
export function postThirdVoice(data: any) {
  return request({
    url: `/voice/third`,
    method: "post",
    data
  });
}

// 创建音色
export function postVoice(data: any) {
  return request({
    url: `/voice`,
    method: "post",
    data
  });
}

// 训练音色
export function trainingVoice(data: any) {
  return request({
    url: `/voice/training`,
    method: "put",
    data
  });
}

// 更新音色
export function putVoice(data: any) {
  return request({
    url: `/voice`,
    method: "put",
    data
  });
}

// 删除音色
export function deleteVoice(params: any) {
  return request({
    url: `/voice/${params.id}`,
    method: "delete",
    params
  });
}


// 音效列表
export function getSoundList(params: any) {
  return request({
    url: `/sound`,
    method: "get",
    params
  });
}
// 音效详情
export function getSoundDetail(params: any) {
  return request({
    url: `/sound/${params.id}`,
    method: "get",
    params
  });
}

// 创建三方已有音效
export function postThirdSound(data: any) {
  return request({
    url: `/sound/third`,
    method: "post",
    data
  });
}

// 创建音效
export function postSound(data: any) {
  return request({
    url: `/sound`,
    method: "post",
    data
  });
}

// 更新音效
export function putSound(data: any) {
  return request({
    url: `/sound`,
    method: "put",
    data
  });
}

// 删除音效
export function deleteSound(params: any) {
  return request({
    url: `/sound/${params.id}`,
    method: "delete",
    params
  });
}


// 物品列表
export function getThingList(params: any) {
  return request({
    url: `/thing`,
    method: "get",
    params
  });
}
// 物品详情
export function getThingDetail(params: any) {
  return request({
    url: `/thing/${params.id}`,
    method: "get",
    params
  });
}

// AI创建物品
export function createThing(data: any) {
  return request({
    url: `/thing/create`,
    method: "post",
    data
  });
}

// 创建物品
export function postThing(data: any) {
  return request({
    url: `/thing`,
    method: "post",
    data
  });
}

// 更新物品
export function putThing(data: any) {
  return request({
    url: `/thing`,
    method: "put",
    data
  });
}

// 删除物品
export function deleteThing(params: any) {
  return request({
    url: `/thing/${params.id}`,
    method: "delete",
    params
  });
}