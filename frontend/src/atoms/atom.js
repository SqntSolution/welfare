import { atom } from "recoil"

export const loginUser = atom({
  key: "loginUser",
  default: {
    "v": null,
    "id": null,
    "name": null,
    "email": null,
    "phone": null,
    "teamCode": null,
    "teamName": null,
    "avatarImgPath": null,
    "role": null,
    "strategicMarketingGroupYn": false,
    "contentsManagerAuthMenuNames": [],
  },
});

export const refreshUserInfo = atom({
  key: "refreshUserInfo",
  default: 0,
});


export const currentMenu = atom({
  key: "currentMenu",
  default: "",
});


export const openLoginModal = atom({
  key: "openLoginModal",
  default: false,
});


/*
[
    {
        "id": 1,
        "menuNm": "Market Analysis",
        "parentMenuId": 0,
        "menuEngNm": "market-analysis",
        "menuSeq": 0,
        "enabled": true,
        "title": "Market Analysis",
        "subTitle": "컬리 마켓은 어디로?",
        "level": 1,
        "hasAuth": true,
        "canDownload": true,
        "menuChildren": [ ]
*/
export const menus = atom({
  key: "menus",
  default: [],
})

/**
 * pdf를 업로드한후에 pdf의 첫번재 장 이미지도 만들어서 업로드하는데,
 * 업로드 한후에 경로.
 */
export const pdfImgPath = atom({
  key: "pdfImgPath",
  default: null,
})

// 타이머의 분 상태
export const minutesState = atom({
  key: 'minutesState', // 고유한 키 값
  default: 0, // 기본 값
});

// 타이머의 초 상태
export const secondsState = atom({
  key: 'secondsState', // 고유한 키 값
  default: 0, // 기본 값
});

// 만료 시간 상태
export const expireAtState = atom({
  key: 'expireAtState',
  default: null,
});

// 마이페이지 접근 상태
export const passwordVerifiedState = atom({
  key: 'passwordVerifiedState',
  default: null,
});

// 접속기기 정보 및 사이즈 정보
export const deviceInfoState = atom({
  key: 'deviceInfoState',
  default: {
    device: 'pc',
    deviceSize: 'pc-m',
  },
});