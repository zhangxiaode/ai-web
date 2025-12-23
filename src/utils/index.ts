export const baseUrl = "./";
export const staticUrl = "https://ai.chengyaokj.com/data" // 静态资源文件路径

const formatNumber = (time: number) => {
  return time < 10 ? "0" + time : time;
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

export const formatVideoDuration = (duration: number) => {
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration % 3600) / 60);
  let seconds = Math.floor(duration % 60);

  let formattedHours = formatNumber(hours);
  let formattedMinutes = formatNumber(minutes);
  let formattedSeconds = formatNumber(seconds);

  let formattedDuration = formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;

  return formattedDuration;
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

// 提取文件名
export const filenameWithoutExt = (filename: string) => filename.lastIndexOf('.') <= 0 ? filename : filename.slice(0, filename.lastIndexOf('.'));

/**
 * 提取文件名和后缀
 * @param {string} path 完整文件路径（如 "https://www.baidu.com/aaa/16_1_林弦.wav?aa=123"）
 * @returns {Object} { name: 主文件名, ext: 后缀名（含.） }
 */
export const splitPath = (path: string): any => {
  const urlWithoutQuery = path.split('?')[0];
  
  const fullFileName: any = urlWithoutQuery.split('/').pop();
  
  const lastDotIndex: any = fullFileName.lastIndexOf('.');
  
  let name: any = fullFileName;
  let ext: any = '';
  
  if (lastDotIndex !== -1) {
    name = fullFileName.substring(0, lastDotIndex);
    ext = fullFileName.substring(lastDotIndex + 1);
  }
  
  return { name, ext };
}

/**
 * 提取文件名和后缀
 * @param {string} filename 完整文件名（如 "16_1_林弦.wav"）
 * @returns {Object} { name: 主文件名, ext: 后缀名（含.） }
 */
export const splitFilename = (filename: string): any => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      name: filename,
      ext: ''
    };
  }
  // 分割主文件名和后缀（后缀包含.，如 .wav）
  return {
    name: filename.substring(0, lastDotIndex), // 16_1_林弦
    ext: filename.substring(lastDotIndex)      // .wav
  };
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

/**
 * 获取运行时 id
 * tips：每次调用都返回一个运行时内唯一的 id，用于各种需要在运行时内临时生成互斥 id 的场景
 * @method runtimeId
 * @return {Number} 运行时 id
 */
let currentRuntimeId = 10000; // tips：默认从 10000 开始
export const runtimeId = () => String(currentRuntimeId++);

// 节流
let repeat: any = false;
export const debouncing = (action: Function, message: any, delay: number, params?: any) => {
    if (repeat) {
        message && message.warning && message.warning('请勿重复点击')
    } else {
        action(params)
        repeat = true
    }
    setTimeout(() => {
        repeat = false
    }, delay)
};
