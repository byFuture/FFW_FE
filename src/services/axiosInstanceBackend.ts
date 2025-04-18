"use server";

import axios from "axios";
import { cookies } from "next/headers";
// import { setCookie } from "nookies";

const axiosInstanceBackend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request interceptor to add auth token
axiosInstanceBackend.interceptors.request.use(async (config: any) => {   
  if(!config._retry){
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
  }
   
   

  return config;
});

axiosInstanceBackend.interceptors.response.use(
  async (response) => {
    // 예시로 status 201 일때 새 토큰이 있을 경우 재시도 처리
    if (response.status === 201) {
      const bearer_token = response.headers['authorization']?.split('Bearer ')[1];
      // 재시도 플래그를 확인하여 무한 루프 방지

      if (bearer_token && !(response.config as any)._retry) {
        const newConfig = {...response.config};
        (newConfig as any)._retry = true;
        newConfig.headers.Authorization = `Bearer ${bearer_token}`;
        // 기존 토큰
        // console.log("기존 토큰", response.request);
        // console.log("url", newConfig.url); 
        // console.log("재시도 토큰4", newConfig.headers.Authorization);
        const result = await axiosInstanceBackend(newConfig);
        
        // 새 토큰을 응답 헤더에 포함시켜 API 라우트에서 Set-Cookie 헤더로 설정할 수 있게 함
        // API 라우트에서는 이 헤더를 읽어 Set-Cookie 헤더를 설정해야 함
        result.headers['authorization'] = `Bearer ${bearer_token}`;
        
        return result;
      }
    }

    return response;
  },
  async (error) => {
    // console.log("에러 발생", error.config.url);
    // console.log("Response Error:", error.response?.data);

    if(error.config.url === "/api/v1/cnsut/users/get-user-basic-info" && error.response?.status === 400){
      return Promise.reject({
        status: 'AUTH_ERROR',
        message: error.response?.data?.result || '인증이 필요합니다'
      });
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      // 리다이렉트 대신 에러 상태를 반환
      return Promise.reject({
        status: 'AUTH_ERROR',
        message: error.response?.data?.result || '인증이 필요합니다'
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstanceBackend;
