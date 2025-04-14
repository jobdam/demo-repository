/** @format */

import Axios, { InternalAxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// api 요청을 할때 interceptor 요청을 가로채기하여 이과정을 먼저 수행해서 통과되어야 한다.
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  console.log("API URL:", apiUrl);

  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: apiUrl,
});
//request 요청의 경우 authRI를 사용.
api.interceptors.request.use(authRequestInterceptor);
//respose 요청을 가로챈다.
api.interceptors.response.use(
  (response) => {
    //데이터는 바로 반환해준다.
    return response.data;
  },
  //에러 반환
  (error) => {
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get("redirectTo") || window.location.pathname;
      window.location.href = pahts.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  }
);
