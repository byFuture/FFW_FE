import axios from "axios";
import { parseCookies, setCookie } from "nookies";
// import { logError } from '@/utils/errorLogger'

// Create an Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", // API base URL from environment variables
  timeout: 180000, // Timeout set to 3 minutes (180,000 ms)
  withCredentials: true, // Allow sending cookies in cross-origin requests
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from cookies
    const cookies = parseCookies();
    const token = cookies.token;

    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle errors in the request configuration
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract Authorization header
    // const authHeader = response.headers["authorization"];
    // if (authHeader && authHeader.startsWith("Bearer ")) {
    //   const token = authHeader.split("Bearer ")[1];
    //   if (token) {
    //     // Save the token in cookies
    //     setCookie(null, "token", token, {
    //       maxAge: 60 * 60 * 1, // 1 day in seconds
    //       path: "/", // Make cookie available application-wide
    //     });

    //     console.log("Token saved to cookies:", token);
    //   }
    // }

    if (response.status === 201) {
      const bearer_token =
        response.headers["authorization"]?.split("Bearer ")[1];
      if (bearer_token) {
        setCookie(null, "token", bearer_token, {
          maxAge: 60 * 60 * 1,
          path: "/",
        });
      }

      const config = response.config;
      return axiosInstance(config);
    }

    return response;
  },
  async (error) => {
    // 에러 로깅
    // await logError(error, 'axiosInterceptor')

    // 기존 에러 처리
    console.log("Response Error:", error.response?.data);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(error.response?.data);
      // console.warn("Unauthorized! Redirecting to login...");
      if (error.response?.data.result === "토큰이 만료되었습니다.") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
