export const baseUrl = "./";
export const staticUrl = "https://ai.chengyaokj.com/data" // 静态资源文件路径

const formatNumber = (n: number) => {
  const num: string = n.toString();
  return num[1] ? num : "0" + num;
};

export function formatZhNumber(num: number) {
  return new Intl.NumberFormat('zh-CN').format(num);
}

export function formatAmount(num: number) {
	num = Number(num);
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, function(_$0, $1) {
		return $1 + ',';
	})
}

export function formatDateTime(date: Date) {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  const hour: number = date.getHours();
  const minute: number = date.getMinutes();
  const second: number = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join(".") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}

export function formatRole(data: any) {
  return data.map((item: any) => {
    if(item.children?.length > 0) {
      formatRole(item.children)
    }else{
      item.children = ""
    }
    return item
  })
}

export const copyToClip = (content: any) => {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

// 是否为移动端
export function hasMobile () {
  let isMobile = false;
  if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    isMobile = true;
  }
  if (document.body.clientWidth < 800) {
    isMobile = true;
  }
  return isMobile
}

