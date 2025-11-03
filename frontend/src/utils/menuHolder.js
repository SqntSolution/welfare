/*
  "id": 1,
  "menuNm": "Market Analysis",
  "parentMenuId": 0,
  "menuEngNm": "market-analysis",
  "menuSeq": 0,
  "enabled": true,
  "title": "Market Analysis",
  "subTitle": "컬리 마켓은 어디로?",
  "contentType": "post",
  "level": 1,
  "hasAuth": true,
  "canDownload": true,
  "menuChildren": []
*/

/**
 * 메인메뉴를 그리면서 window에도 보관함.
 */
export const saveMenus = (jsonObj) => {
    window.__cmsmenus__ = jsonObj
    // console.log("=== menu 저장함", jsonObj?.length)
    // throw new Error('이 메소드는 사용하면 앙대요.');
    // try {
    //     const str = JSON.stringify(json ?? [])
    //     localStorage.setItem('__menu__', str)
    // } catch (error) {
    //     console.log("=== [에러] setMenus :", error)
    // }
}

/**
 * window에 보관한 menu들을 리턴.
 */
export const getMenus = () => {
    const m = window.__cmsmenus__
    if(m==null){
        return {}
    }
    // 복제
    try {
        return JSON.parse(JSON.stringify(m))
    } catch (error) {
        return {}
    }
}

/**
 * [주의] 이 함수는 쓰지 마세요.
 * 2차 menu에 전체메뉴가 있어야 하는지 여부.
 * (1차 menu의 contentType이 smartfinder, cscenter, my가 아니면 전체 메뉴가 있음.)
 */
export const hasTotalMenu = (menu1Path, menus) => {
    if(menus==null){
        menus = window.__cmsmenus__ ?? []
    }
    // console.log("=== menu1Path : ", menu1Path, menus)
    const candidates= ['smartfinder', 'cscenter', 'my'] 
    const m = menus.find(m=>m.menuEngNm==menu1Path && !candidates.includes(m.contentType))
    // console.log("=== m : ", m)

    return m!=null
}