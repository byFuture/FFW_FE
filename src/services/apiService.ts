import axiosInstance from "./axiosInstance";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://211.253.241.27:8090";

// Generic API Response Structure
export interface ApiResponse<T> {
  status: number; // e.g., 200 for success
  result: T; // Actual payload data
  message?: string; // Optional message
}

export interface ApiDataFullResponse {
  results: any;
}

export const useApi = () => {
  // const { toast } = useToast();
  // Get Image File
  const getImageFile = async <T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> => {
    try {
      const response = await axiosInstance.get(url.replace(baseUrl, ""), {
        params,
        responseType: "blob", // receive blob data
      });

      return response.data as T; // return blob
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Utility function to extract filename from content-disposition
  const extractFilename = (contentDisposition: string): string => {
    const filenameMatch =
      contentDisposition && contentDisposition.match(/filename\*=UTF-8''(.+)/);
    return filenameMatch
      ? decodeURIComponent(filenameMatch[1])
      : "downloaded_file";
  };

  // Get File as Blob (for PDF viewer)
  const getFileBlob = async (
    url: string,
    params?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<{ blob: Blob; filename: string }> => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: "arraybuffer",
        headers: {
          Accept: "application/octet-stream",
        },
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename = extractFilename(contentDisposition);

      // console.log(response.headers);
      // For PDF viewer, convert octet-stream to pdf type
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] === "application/octet-stream"
            ? "application/pdf"
            : response.headers["content-type"],
      });

      return { blob, filename };
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Get File for Download (keeps original content-type)
  const getFileDownload = async (
    url: string,
    params?: Record<string, any>,
    customFilename?: string
  ): Promise<void> => {
    try {
      const response = await axiosInstance.get(url, {
        params,
        responseType: "arraybuffer",
        headers: {
          Accept: "application/octet-stream",
        },
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename = customFilename || extractFilename(contentDisposition);

      // For download, keep the original content-type
      const contentType =
        response.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([response.data], { type: contentType });

      const downloadUrl = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic GET Request
  const getData = async <T>(
    url: string,
    params?: Record<string, any>
  ): Promise<T> => {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
      if (response.data.status === 200) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic POST Request
  const postData = async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = { "Content-Type": contentType };
      const response = await axiosInstance.post<ApiResponse<T>>(url, data, {
        headers,
      });
      if (response.data.status === 200) {
        return response.data.result;
      } else if (response.data.status === 302) {
        return { ...response.data.result, status: 302 };
      } else {
        throw new Error(response.data.message || "Failed to post data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic POST Request
  const postDataBlob = async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = { "Content-Type": contentType };
      const response = await axiosInstance.post<ApiResponse<T>>(url, data, {
        headers,
        responseType: "blob",
      });
      if (response.status === 200) {
        return response.data as T;
      } else {
        throw new Error(response.data.message || "Failed to post blob data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic POST Request
  const postDataResFull = async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = { "Content-Type": contentType };
      const response = await axiosInstance.post<ApiDataFullResponse>(
        url,
        data,
        {
          headers,
        }
      );
      if (response.data && response.data.results) {
        return response.data.results as T;
      } else {
        throw new Error("Failed to post data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic PUT Request
  const putData = async <T>(
    url: string,
    data: Record<string, any> | FormData,
    contentType: "application/json" | "multipart/form-data" = "application/json"
  ): Promise<T> => {
    try {
      const headers = { "Content-Type": contentType };
      const response = await axiosInstance.put<ApiResponse<T>>(url, data, {
        headers,
      });
      if (response.data.status === 200) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Failed to update data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Generic DELETE Request
  const deleteData = async <T>(url: string): Promise<T> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url);
      if (response.data.status === 200) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || "Failed to delete data");
      }
    } catch (error: any) {
      handleApiError(error);
      throw error;
    }
  };

  // Handle API Errors
  const handleApiError = (error: any) => {
    if (error.response) {
      // toast({
      //   title: "Error",
      //   description: error.response.data.message || "API error occurred",
      //   variant: "destructive",
      // });
      console.log("API Error Response:", error.response.data);
    } else if (error.request) {
      // toast({
      //   title: "Network Error",
      //   description: "No response from server. Please try again later.",
      //   variant: "destructive",
      // });
      console.log("API Error Request:", error.request);
    } else {
      // toast({
      //   title: "Unexpected Error",
      //   description: error.message || "An unexpected error occurred",
      //   variant: "destructive",
      // });
      console.log("API Error Message:", error.message);
    }
  };
  return {
    getImageFile,
    getData,
    postData,
    postDataBlob,
    postDataResFull,
    putData,
    deleteData,
    getFileBlob,
    getFileDownload,
  };
};
