import { AxiosError } from "axios";
import axiosInstanceBackend from "./axiosInstanceBackend";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://211.253.241.27:8090";

// Generic API Response Structure
interface ApiResponse<T> {
  status: number;
  result: T;
  message?: string;
}

interface ApiDataFullResponse {
  results: any;
}

function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.status === 200 || response.status === 302) {
    if (response.result === null) {
      throw new Error("No data returned from server");
    }
    return response.result;
  }
  throw new Error(response.message || "요청을 처리할 수 없습니다.");
}

function handleApiAuthResponse<T>(response: ApiResponse<T>): T {
  if (response.status === 200 || response.status === 302) {
    return response.result;
  } else if (response.status === 403) {
    return {
      status: response.status,
      result: null,
      message: "토큰이 만료되었습니다. 다시 로그인 해주세요.",
    } as T;
  }
  throw new Error(response.message || "요청을 처리할 수 없습니다.");
}

type AxiosErrorExtended = AxiosError & {
  response: { data: { message?: string } };
};

function handleAxiosError(error: AxiosErrorExtended): never {
  console.log(error);
  if (error.response) {
    throw new Error(
      error.response.data?.message || "서버 응답 오류가 발생했습니다."
    );
  } else if (error.request) {
    throw new Error("서버에 연결할 수 없습니다.");
  } else {
    throw new Error("잘못된 요청입니다.");
  }
}

// 서버사이드에서 사용하는 api 서비스 예시입니다.
// Backend-only API service
export const apiServiceBackend = {
  getImageFile: async <T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> => {
    try {
      const response = await axiosInstanceBackend.get(
        url.replace(baseUrl, ""),
        {
          params,
          responseType: "blob",
        }
      );
      return response.data as T;
    } catch (error) {
      throw handleAxiosError(error as AxiosErrorExtended);
    }
  },

  getData: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    try {
      const response = await axiosInstanceBackend.get<ApiResponse<T>>(url, {
        params,
      });
      return handleApiResponse(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw handleAxiosError(error as AxiosErrorExtended);
      }
      throw new Error("내부 서버 오류가 발생했습니다.");
    }
  },

  postData: async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType:
      | "application/json"
      | "multipart/form-data" = "application/json",
    forcedReturn?: T
  ): Promise<T> => {
    try {
      const headers = contentType ? { "Content-Type": contentType } : undefined;
      const response = await axiosInstanceBackend.post<ApiResponse<T>>(
        url,
        data,
        {
          headers,
        }
      );
      if (forcedReturn && response.data.result === null) {
        return forcedReturn;
      }

      return handleApiResponse(response.data);
    } catch (error) {
      if (forcedReturn) {
        return forcedReturn;
      }
      throw handleAxiosError(error as AxiosErrorExtended);
    }
  },

  postAuthData: async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = contentType ? { "Content-Type": contentType } : undefined;
      const response = await axiosInstanceBackend.post<ApiResponse<T>>(
        url,
        data,
        {
          headers,
        }
      );
      console.log("로그인 데이터 전송\n\n\n\n\n");
      return handleApiAuthResponse(response.data);
    } catch {
      return {
        status: 403,
        result: null,
        message: "토큰이 만료되었습니다. 다시 로그인 해주세요.",
      } as T;
      // throw handleAxiosError(error as AxiosErrorExtended);
    }
  },

  postDataResFull: async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = contentType ? { "Content-Type": contentType } : undefined;
      const response = await axiosInstanceBackend.post<ApiDataFullResponse>(
        url,
        data,
        {
          headers,
        }
      );
      if (response.data && response.data.results) {
        return response.data.results as T;
      }
      throw new Error("No results returned.");
    } catch (error) {
      throw handleAxiosError(error as AxiosErrorExtended);
    }
  },
};
