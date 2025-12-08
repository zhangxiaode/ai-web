import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";
import { getToken, removeToken } from "./auth";

const { message, loadingBar } = createDiscreteApi(["message", "loadingBar"]);

const service: AxiosInstance = axios.create({
  baseURL: "/ai/apis",
  withCredentials: true,
  timeout: 36000000
});

service.interceptors.request.use(
  (config: any) => {
    localStorage.setItem('mode', import.meta.env.MODE)
    config.headers['Accept'] = '*/*'
    // const token = getToken();
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // } else if (location.pathname !== '/login'){
    //   location.href = `/login?redirect=${window.location.pathname + window.location.search}`;
    // }
    // config.onUploadProgress = (progressEvent: any) => {
    //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //   console.log(`Upload Progress: ${percentCompleted}%`);
    //   // 在这里可以处理进度条或 UI 更新
    // };
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: any) => {
    if (response?.data?.code === 401) {
      removeToken()
      message.error("用户身份已失效，请重新登录", {
        onAfterLeave: () => {
          location.href = `/login?redirect=${window.location.pathname + window.location.search}`;
        }
      });
      return;
    }
    return response?.data;
  },
  (error: any) => {
    if(error?.response?.status === 401) {
      removeToken()
      message.error("用户身份已失效，请重新登录", {
        onAfterLeave: () => {
          location.href = `/login?redirect=${window.location.pathname + window.location.search}`;
        }
      });
    }
    // message.error(error.message);
    return Promise.reject(error);
  }
);

// 封装axios---------------------------------------
function apiAxios(httpDefault: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    loadingBar.start();
    service(httpDefault)
      .then((response: any) => {
        if(response) {
          switch (response?.code) {
            case 200:
              resolve(response);
              break;
            case 0:
              resolve(response);
              break;
            default:
              message.error(response?.message || "error");
              reject(response);
          }
        } else {
          resolve(response)
        }
      })
      .catch((error: any) => {
        message.error(error?.response?.data?.message || "error");
        console.log(123, error)
        reject(new Object());
      })
      .finally(() => {
        loadingBar.finish();
      });
  });
}
export default apiAxios;
