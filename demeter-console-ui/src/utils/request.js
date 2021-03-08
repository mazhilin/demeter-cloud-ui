import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  headers: { "Access-Control-Allow-Origin": "*" },
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 36000 * 10000, // request timeout
  maxContentLength: 4096,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Console-Web-Token']为自定义key 请根据实际情况自行修改
      config.headers["X-Console-Web-Token"] = getToken();
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const result = response.data;
    if (result.code === 501) {
      MessageBox.alert(result.message, "错误", {
        confirmButtonText: "确定",
        type: "error",
      }).then(() => {
        store.dispatch("FedLogOut").then(() => {
          location.reload();
        });
      });
      return Promise.reject("error");
    } else if (result.code === 502) {
      MessageBox.alert(result.message, "错误", {
        confirmButtonText: "确定",
        type: "error",
      });
      return Promise.reject("error");
    } else if (result.code === 503) {
      MessageBox.alert(result.message, "警告", {
        confirmButtonText: "确定",
        type: "error",
      });
      return Promise.reject("error");
    } else if (result.code === 504) {
      MessageBox.alert(result.message, "警告", {
        confirmButtonText: "确定",
        type: "error",
      });
      return Promise.reject("error");
    } else if (result.code === 505) {
      MessageBox.alert(result.message, "警告", {
        confirmButtonText: "确定",
        type: "error",
      });
      return Promise.reject("error");
    } else if (result.code === 506) {
      MessageBox.alert(result.message, "错误", {
        confirmButtonText: "确定",
        type: "error",
      });
      return Promise.reject("error");
    } else if (result.code !== 200) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return Promise.reject(response);
    } else {
      return response;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: "登录连接超时（后台不能连接，请联系系统管理员）",
      type: "error",
      duration: 36000 * 100000,
    });
    return Promise.reject(error);
  }
);

export default service;
