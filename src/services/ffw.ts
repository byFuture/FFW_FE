// 응답 요청 타입들을 가져와 주세요.
// import { GetNoticesResponse } from "@/types/response";
// import { GetContentRequest } from "@/types/parameters";
// import { useApi } from "./apiService";

// apiService 에서 사용하는 함수들을 가져와 주세요.
export const useFFW = () => {
  //   const {
  //     getData,
  //     postData,
  //     postDataBlob,
  //     postDataResFull,
  //     getImageFile,
  //     getFileBlob,
  //     getFileDownload,
  //   } = useApi();
  //   const getImage = async (url: string): Promise<Blob> => {
  //     return getImageFile<Blob>(url);
  //   };
  //   const getNotice = async (
  //     data: GetNoticeRequest
  //   ): Promise<GetNoticeResponse> => {
  //     const url = "/api/v1/cnsut/boards/get-notice";
  //     return postData<GetNoticeResponse>(url, data);
  //   };
  //   //api/v1/cnsut/main/banner/{bannerId}
  //   const getBanner = async (
  //     bannerId: number
  //   ): Promise<{ blob: Blob; filename: string }> => {
  //     const url = `/api/v1/cnsut/main/banner/${bannerId}`;
  //     return getFileBlob(url, undefined);
  //   };
  //   // Download pdf file, 수정필요
  //   const downloadPdfFile = async (
  //     fileId: number,
  //     filename?: string
  //   ): Promise<void> => {
  //     return getFileDownload(
  //       `/api/v1/cnsut/boards/file/download/${fileId}`,
  //       undefined,
  //       filename
  //     );
  //   };
  //   //viewr pdf file, 수정필요
  //   const viewPdfFile = async (
  //     fileId: number,
  //     onProgress?: (progress: number) => void
  //   ): Promise<{ blob: Blob; filename: string }> => {
  //     return getFileBlob(
  //       `/api/v1/cnsut/boards/file/viewer/${fileId}`,
  //       undefined,
  //       onProgress
  //     );
  //   };
  //   //viewr pdf file, 수정필요
  //   const viewPdfFileHTML = async (
  //     fileId: number
  //   ): Promise<{ html: string; filename: string }> => {
  //     return postData<{ html: string; filename: string }>(
  //       `/api/v1/cnsut/publications/file/html-viewer/${fileId}`,
  //       {}
  //     );
  //   };
  //   return {
  //     getImage,
  //     getNotice,
  //     downloadPdfFile,
  //     viewPdfFile,
  //     viewPdfFileHTML,
  //     getBanner,
};
