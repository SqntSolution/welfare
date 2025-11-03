// import { pageTitle, currentMenu } from 'atoms/atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { EtcFileColorLine, ExcelColorLine, ExecelLine, HwplLine, ImgColorLine, PdfColorLine, PptColorLine, VideoColorLine } from 'components/common/IconComponets';
import { AXIOS } from './axios';
import JSEncrypt from 'jsencrypt';

// export const SetPageTitleWithMenu = ({ title, menuId }) => {
// 	const [_, setThePageTitle] = useRecoilState(pageTitle);
// 	const [currentMenuId, setCurrentMenuId] = useRecoilState(currentMenu);

// 	useEffect(() => {
// 		// console.log('==== set page title => ', title, menuId);
// 		if (title != null) {
// 			setThePageTitle(title);
// 		}

// 		//각 메뉴페이지에서 메뉴아이디 전달...
// 		if (typeof menuId === 'undefined' || menuId === null || menuId === '') {
// 		} else {
// 			// console.log('=== Set menuId', menuId);
// 			setCurrentMenuId(menuId);
// 		}
// 		// console.log("== currentMenuId : ", currentMenu);

// 		return () => {
// 			setThePageTitle('');
// 		};
// 	}, [title, menuId]);
// };

// 아래껀 안 씀.
export const processFileUploading = (file, fileList) => {
	/*
		==== antd 포맷
		uid: '-1',
		name: 'image1.png',
		status: 'done',
		url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
	*/
	// status가 done
	if (file?.status === 'done') {
		// done이면 antd 포맷에 맞게 업데이트
		for (let f of fileList) {
			if (f.uid === file.uid) {
				console.log("=== f:", f);
				// uid는 path값으로
				f.uid = f?.response?.path ?? f.uid;
				f.path = f?.response?.path;
				f.url = '/api/v1/download/' + f?.response?.path + '?name=' + encodeURIComponent(f.name);
				if (f.fileExtension == null && f?.response?.fileExtension != null) {
					f.fileExtension = f?.response?.fileExtension;
				}
				break;
			}
		}
		return fileList;
	} else {
		return fileList;
	}
};

/**
 * axios 응답 에러에 대해서, 에러 메시지를 출력.
  (사용예)
  AXIOS.post(`/api/v1/xxx`)
			.then((resp) => {
				// ~~~
			})
			.catch((err) => {
				messageApi.error('에러 : ' + errorMsg(err), 10);
				throw err;
			})
			.finally(() => {
				setLoading(false);
			});
 */
export const errorMsg = (responseErr) => {
	if (typeof responseErr == 'string') {
		return responseErr
	}
	const status = responseErr?.response?.status
	console.log("=== responseErr status :", responseErr)
	let bizMsg = responseErr?.response?.data?.errMsg;
	if (bizMsg != null) {
		return bizMsg;
	} else if (status === 404) {
		return "존재하지 않는 API 호출";
	} else if (status === 401) {
		return "로그인을 해주세요.";
	} else if (status === 403) {
		return "권한이 없습니다.";
	} else {
		return "에러가 발생했습니다.";
	}
}


/**
 * empty 체크 - null, '', undefined, [], {}
 * @param {*} input
 * @returns 
 */
export const isEmptyCheck = (input) => {
	if (
		input == null ||
		input == '' ||
		input == null ||
		input.length == 0 ||
		(typeof input === 'object' && !Object.keys(input).length)
	) {
		return true;
	} else {
		return false;
	}
};

export const coverImgStyle = {
	objectFit: "cover", margin: 'auto', width: '100%', height: '100%',
}


//파일 확장자들
const ExtensionList = {
	PowerPoint: ['ppt', 'pptx', 'pptm'],
	Excel: ['xls', 'xlsx', 'xlsm', 'xlsb', 'xltm', 'xlam', 'xltx'],
	Pdf: ['pdf'],
	Image: ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp', 'bmp', 'ico', 'cur', 'tif', 'tiff'],
	Video: ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'mkv', 'webm', 'mpeg2', 'mpeg4'],
};

// 파일 아이콘
export const iconHandle = (fileExtension) => {


	if (ExtensionList.Pdf.includes(fileExtension?.toLowerCase())) {
		return (<PdfColorLine />)
	} else if (ExtensionList.Image.includes(fileExtension?.toLowerCase())) {
		return (<ImgColorLine />)
	} else if (ExtensionList.Excel.includes(fileExtension?.toLowerCase())) {
		return (<ExcelColorLine />)
	} else if (ExtensionList.PowerPoint.includes(fileExtension?.toLowerCase())) {
		return (<PptColorLine />)
	} else if (ExtensionList.Video.includes(fileExtension?.toLowerCase())) {
		return (<VideoColorLine />)
	} else {
		// 기본 파일 아이콘
		return (<EtcFileColorLine />);
	}
}



/**
 * uuid 생성
 * @returns 
 */
export const generateUUID = () => {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);

	// RFC 4122 버전 4 규칙 적용
	array[6] = (array[6] & 0x0f) | 0x40; // UUID v4 적용
	array[8] = (array[8] & 0x3f) | 0x80; // Variant 적용

	return [...array]
		.map((byte, i) =>
			[4, 6, 8, 10].includes(i) ? `-${byte.toString(16).padStart(2, "0")}` : byte.toString(16).padStart(2, "0")
		)
		.join("");
};


/**
 * 화면 언로드 이벤트감지
 * @param {boolean} enabled 
 * @param {String} message 
 */
export const useBeforeUnload = (enabled = true, message = "변경사항이 저장되지 않을 수 있습니다.") => {
	useEffect(() => {
		if (!enabled) return;

		const handleBeforeUnload = (event) => {
			event.preventDefault();
			event.returnValue = message; // 일부 브라우저에서는 returnValue 필요
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [enabled, message]);
};

/**
 * mac 사용자인지 확인 
 * @returns 
 */
export const isUserAgentMac = () => {
	return (navigator.userAgentData?.platform === "macOS") || /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
}


/**
 * ctrlKey 확인
 * @param {event} event 
 * @returns 
 */
export const isCtrlKey = (event) => {
	return isUserAgentMac() ? event.metaKey : event.ctrlKey
}

/**
 * altKey 확인
 * @param {event} event 
 * @returns 
 */
export const isAltKey = (event) => {
	return event.altKey;
};

/**
 * shiftKey 확인
 * @param {event} event 
 * @returns 
 */
export const isShiftKey = (event) => {
	return event.shiftKey;
};

/**
 * 만료일자 기준으로 남은 초 계산 (만료 시간 - 현재 시간)
 * @param {Date} expireAt - 만료 시간
 * @returns
 */
export const getSecWithCurrTime = (expireAt) => {
	// 현재 시간 밀리초
	const currentTime = Date.now();

	// 남은 시간 계산 (만료 시간 - 현재 시간)
	const remainingTime = expireAt - currentTime;

	// 남은 시간을 분과 초로 변환
	return Math.floor(remainingTime / 1000);
}

/**
 * 공개키로 아이디와 비밀번호 암호화 하기
 * @param {} sessionid 
 * @returns 
 */
export const getPublicKey = async (sessionid, userId, passwd) => {
	try {
		const res = await AXIOS.get(`/api/v1/common/login/pk`, { params: { si: sessionid } });
		const publicKey = res?.data
		const encryptor = new JSEncrypt();
		encryptor.setPublicKey(publicKey);
		const delimiter = '||'; // 구분자, 해킹 방지를 위해 특수문자 조합 추천 (예: "||" 또는 UUID 패턴)
		const rawData = `${userId}${delimiter}${passwd}`
		return encryptor.encrypt(rawData);
	} catch (err) {
		console.error('getSessionid error:', err);
		return null;
	}
};