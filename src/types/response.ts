// 예시 코드 여기서 api 응답값의 타입을 작성해주세요.
export interface GetNoticesResponse {
  content: string;
  pageable: string;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  number: number;
  size: number;
  empty: boolean;
}
