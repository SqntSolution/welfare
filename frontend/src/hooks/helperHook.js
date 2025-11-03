import { menus } from 'atoms/atom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useState, useCallback } from 'react';
import { App, Typography } from 'antd';
import { errorMsg, generateUUID, isCtrlKey } from 'utils/helpers';
import { useUserInfo } from 'hooks/useUserInfo';
/*
전체 화면에 scroll이 생기지 않게 하도록 함.
(사용예)
import {useNoScroll} from 'hooks/helperHook'
	useNoScroll();
*/
// export const useNoScroll = () => {
// 	const setTheNoScroll = useSetRecoilState(noScroll);
// 	useEffect(() => {
// 		setTheNoScroll(true);
// 		return () => {
// 			setTheNoScroll(false);
// 		};
// 	}, []);
// }

// export const useShowLoginModal = () => {
// 	const setOpenLoginModal = useSetRecoilState(openLoginModal);
// 	return setOpenLoginModal
// }

/**
  === 사용법 ===
	import { useCopy } from 'hooks/helperHook';
	const copy = useCopy()
	const onShareClick = () => {
		copy(`${window.location.href}`)
	}
 */
export const useCopy = () => {
	const { notification } = App.useApp();

	const copy = (text) => {
		// const currentUrl = window.location.href;
		const host = window.location.host;
		const protocol = window.location.protocol;
		// const link = `${protocol}//${host}/api/v1/download/${id}`
		// console.log("=== location : ", link)
		var tempInput = document.createElement("input");
		tempInput.value = text;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand("copy");
		document.body.removeChild(tempInput);

		notification.info({
			message: `복사하였습니다. `, description: `${text}`, placement: 'topRight', duration: 3
		})
	}

	return copy

}

/**
 === 사용법 ===
 import { useMsg } from 'hooks/helperHook';
 const {error, info} = useMsg()
 error(err) 또는 info("저장하였습니다.")
 */
export const useMsg = () => {
	const { notification } = App.useApp();

	const error = (error, duration = 4) => (
		notification.error({ message: <Typography.Text type='danger'>{errorMsg(error) ?? ''}</Typography.Text>, placement: 'topRight', duration: duration })
	)

	const info = (msg, duration = 3) => {
		notification.info({ message: msg, placement: 'topRight', duration: duration });
	}

	return { error, info }
}

export const useGetMenus = () => {
	const theMenus = useRecoilValue(menus);
	return theMenus
}

export const useSetMenus = () => {
	const setMenus = useSetRecoilState(menus);
	return setMenus
}

/**
 해당 메뉴에 대해서 편집할 수 있는 권한이 있는지 체크
 (ROLE_OPERATOR, ROLE_MASTER, ROLE_CONTENTS_MANAGER)
 */
export const useHasEditAuth = () => {
	const user = useUserInfo()
	const role = user?.role

	const hasAuth = (menu1, menu2) => {

		if (role == 'ROLE_OPERATOR' || role == 'ROLE_MASTER') {
			return true
		}

		if (role == 'ROLE_CONTENTS_MANAGER') {
			const menu1Path = menu1?.path ?? menu1
			const menu2Path = menu2?.path ?? menu2
			// 컨텐츠 관리자인 경우에는, 1차,2차 메뉴 체크
			// console.log("=== contentsManagerAuthMenuNames : ", menu1Path, menu2Path, user?.contentsManagerAuthMenuNames)
			const found = user?.contentsManagerAuthMenuNames?.find(e => {
				const length = e?.length
				if (length == 2) {
					return e[0] == menu1Path && e[1] == menu2Path
				} else {
					return false
				}
				// if(length==1){
				// 	return e[0]==menu1Path
				// }else if(length==2){
				// 	return e[0]==menu1Path && e[1]==menu2Path
				// }else{
				// 	return false
				// }
			})
			return found != null
		}
		return false
	}

	return hasAuth

}


/**
 새로운 Post를 등록할 수 있는 권한이 있는지 체크
 (ROLE_OPERATOR, ROLE_MASTER, ROLE_CONTENTS_MANAGER)
 */
export const useHasNewPostAuth = () => {
	const user = useUserInfo()
	const role = user?.role

	const hasAuth = () => {

		if (role == 'ROLE_OPERATOR' || role == 'ROLE_MASTER' || role == 'ROLE_CONTENTS_MANAGER') {
			return true
		} else {
			return false
		}
	}

	return hasAuth

}


/**
 * pdf 새창으로 사용하기 위한 훅
 */
export const usePdfPreview = () => {
	const [pdfModalData, setPdfModalData] = useState({});
	const [pdfModalOpen, setPdfModalOpen] = useState(false);

	const openPdfModal = useCallback((item) => {
		setPdfModalData(item);
		setPdfModalOpen(true);
	}, []);

	const closePdfModal = () => {
		setPdfModalData({});
		setPdfModalOpen(false);
	};

	const openNewWindow = useCallback((item) => {
		// 새 창에서 PDF 뷰어 페이지 열기
		const uuid = generateUUID();
		const newWindow = window.open(`/pdfviewer/${uuid}`, "_blank");
		// 데이터가 로드될 수 있도록 delay 처리
		setTimeout(() => {
			newWindow?.postMessage({ data: { ...item }, isNewPopup: true }, window.location.origin);
		}, 3000);
	}, []);

	const openPopupPreviewPdf = useCallback((event, item) => {
		if (isCtrlKey(event)) {
			openNewWindow(item);
		} else {
			openPdfModal(item);
		}
	}, [openNewWindow, openPdfModal]);

	return {
		pdfModalData,
		pdfModalOpen,
		openPdfModal,
		closePdfModal,
		openPopupPreviewPdf,
		openNewWindow,
	};
};