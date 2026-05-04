import axios from "axios";
import CONFIG from "../config";

const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 5000,
  withCredentials: true, // 쿠키 전송 허용
  withXSRFToken: true,

  xsrfCookieName: 'XSRF-TOKEN', // CSRF 토큰 쿠키 이름
  xsrfHeaderName: 'X-XSRF-TOKEN', // CSRF 토큰 헤더 이름
  headers: {
    'Content-Type': 'application/json',   // 기본값 명시
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰 넣고 싶으면 여기서 가능
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 인증 만료 등 공통처리
    return Promise.reject(error);
  }
);

export default api;