import axios from 'axios';
import { openLoginModal } from 'atoms/atom';
// import {useShowLoginModal} from 'hooks/helperHook'
import { setRecoil } from "recoil-nexus";
import { isEmptyCheck } from 'utils/helpers';

const AXIOS = axios.create({
	// baseURL: "http://localhost:8080/api/v1",
	baseURL: '/',
	//  validateStatus: status=> status >= 200 && status < 300,
	//  maxRedirects: 0
	// baseURL: 'http://localhost:8000'
	// baseURL: "http://localhost:8080",
	// baseURL: "http://localhost:9999",
	// baseURL: "http://15.165.122.0:8080",
	// headers: {
	//   "Content-type": "application/json",
	// },
	paramsSerializer: (params) => {
		return Object.keys(params)
			.map((key) => {
				const value = params[key];
				if (Array.isArray(value)) {
					return value
						.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
						.join('&');
				}
				if (typeof value === 'object' && value !== null) {
					return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
				}
				if (value === null || value === undefined || value === '') {
					return '';
				}
				return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			})
			.filter(Boolean)
			.join('&');
	},
	withCredentials: true, // ✅ 쿠키 포함 요청 허용
});


/**
  1. 요청 인터셉터
 */
AXIOS.interceptors.request.use(
	(config) => {
		// 요청 시간 기록 (응답 로그에서 걸린 시간 체크용)
		config.metadata = config.metadata || {};
		config.metadata.startTime = new Date().getTime();
		// let token = localStorage.getItem('ttt')
		// if(token!=null){
		//   // config.headers = { "Authorization": "Bearer " + token};
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error) => {
		// 요청 에러 직전 호출됩니다.
		return Promise.reject(error);
	}
);

let last401Time = 0;
const updateAndCheckLast401Time = () => {
	const oldTime = last401Time;
	const timestamp = new Date().getTime();
	last401Time = timestamp;
	// 3초가 넘었다면
	const over = last401Time - oldTime > 3 * 1000;
	console.log("=== over : ", over);
	return over;
}


/**
 /**
  2. 응답 인터셉터
  */
AXIOS.interceptors.response.use(
	(response) => {
		// 개발 환경에서만 응답 로그 출력 + 요청 주소, 요청시간, 걸린시간 등 추가
		if (process.env.NODE_ENV === 'development') {
			const config = response.config;
			const url = config.url;
			const method = config.method?.toUpperCase();
			const requestTime = config.metadata?.startTime || null;
			const responseTime = new Date().getTime();
			let duration = null;
			if (requestTime) {
				duration = responseTime - requestTime;
			}

			// 민감한 정보 제거
			const sanitizedData = response.data;
			const sanitizedHeaders = { ...response.headers };

			// Authorization 헤더 제거
			if (sanitizedHeaders.authorization) {
				sanitizedHeaders.authorization = '[REDACTED]';
			}
			if (sanitizedHeaders.Authorization) {
				sanitizedHeaders.Authorization = '[REDACTED]';
			}

			// 쿠키 정보 제거
			if (sanitizedHeaders.cookie) {
				sanitizedHeaders.cookie = '[REDACTED]';
			}
			if (sanitizedHeaders.Cookie) {
				sanitizedHeaders.Cookie = '[REDACTED]';
			}

			console.info(`[API 응답] [${method} ${url}]`, {
				url,
				method,
				requestTime: requestTime ? new Date(requestTime).toISOString() : null,
				responseTime: new Date(responseTime).toISOString(),
				duration: duration !== null ? `${duration}ms` : '측정불가',
				status: response.status,
				data: sanitizedData,
				headers: sanitizedHeaders
			});
		}
		return response;
	},

	(error) => {
		// const setOpenLoginModal= useShowLoginModal()
		console.log("=== axios response error : ", error?.response?.status, error?.response?.data);
		console.log("=== axios error?.request : ", error?.request, error?.request?.responseURL);
		const status = error?.response?.status;
		// const isLoginDrop = error?.request?.responseURL?.endsWith('?dropLogin')
		if (status === 401) {
			// 로그인 필요
			// originPath
			console.log("=== need login");

			if (updateAndCheckLast401Time()) {
				const currentPath = window.location.pathname;
				console.log("currentPath : ", currentPath);
				document.cookie = "originPath=" + currentPath + "; path=/"
				window.location.href = "/api/v1/sso/ad-sso/login";
			}

		} else {
			return Promise.reject(error);
		}
	}
);

export { AXIOS };