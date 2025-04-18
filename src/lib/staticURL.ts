// 내부 사이트 경로 정보를 작성해주세요.

export const staticURL = {
  _portal: "http://211.253.241.27:5001",
  // 표준인포그래픽
  dynamic: "/dynamic",
  // ICT 표준자문
  introduction: "/dynamic/328",
  consultingTypes: "/dynamic/329",
  standardUtilizationGuide: "/dynamic/330",

  // 자문사례
  consultingCases: "/consulting-cases",

  // 자문신청/조회
  registerApp: "/register-app",
  register: "/register",
  userGuide: "/user-guide",

  // 자문전문가
  advisoryExpert: "/advisory-expert",

  // 알림마당
  advisoryQna: "/advisory-qna",
  advisoryFaq: "/advisory-faq",
  advisoryNotice: "/advisory-notice",
  advisoryResource: "/advisory-resource",
  advisoryBusiness: "/advisory-business",
  privacyCompany: "/privacy-company",
  companyStep2: "/info1",
  privacyExternals: "/privacy-externals",
  externalsStep2: "/form-register",
} as const;
