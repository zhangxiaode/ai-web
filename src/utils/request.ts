import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";

const { message, loadingBar } = createDiscreteApi(["message", "loadingBar"]);

const service: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 封装axios---------------------------------------
function apiAxios(httpDefault: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    loadingBar.start();
    service(httpDefault)
      .then((response: any) => {
        switch (response.code) {
          case 200:
            resolve(response);
            break;
          case 0:
            resolve(response);
            break;
          default:
            message.error(response.msg || "error");
        }
      })
      .catch((error: any) => {
        message.error(error?.response?.data?.message || "error");
        reject(error);
      })
      .finally(() => {
        loadingBar.finish();
      });
  });
}

export default apiAxios;
