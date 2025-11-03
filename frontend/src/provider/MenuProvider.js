import { menus, refreshUserInfo } from "atoms/atom";
import { useUserInfo } from "hooks/useUserInfo";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AXIOS } from "utils/axios";
import { errorMsg } from "utils/helpers";
import { saveMenus } from "utils/menuHolder";
import { useLoginCheck } from "./LoginCheckProvider";

const MenuContext = createContext({
    isLoading: false,
    isLoaded: false,
    menuData: [],
    recommendedKeyword: [],
    reloadMenu: () => { },
});
export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
    const setMenu = useSetRecoilState(menus);
    const loginUser = useUserInfo();
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const loadedRef = useRef(false); // 새로고침 전까지 캐시
    const { isInitialCheckComplete } = useLoginCheck();
    const theRefreshUserInfo = useRecoilValue(refreshUserInfo);

    // 메뉴 조회
    const getMenu = async () => {
        if (loadedRef.current) return; // 이미 조회된 경우 생략
        setIsLoading(true);
        try {
            const res = await AXIOS.get(`/api/v1/common/menu/main`);

            console.log("=== 1차 res : ", res)
            const data = res?.data ?? [];
            setMenuData(data);
            setMenu(data);
            saveMenus(data);
            setIsLoaded(true);
            loadedRef.current = true;
        } catch (err) {
            errorMsg(err);
        } finally {
            setIsLoading(false);
        }
    };

    // 추천 키워드 조회
    const getRecommendedKeyword = async () => {
        try {
            const res = await AXIOS.get(`/api/v1/user/search/recommend/keyword`);
            const keywords = res?.data?.map((keyword) => keyword.keyword);
            setKeywords(keywords ?? []);
        } catch (err) {
            setKeywords([]);
        }
    };

    // 최초 1회만 메뉴/키워드 조회
    useEffect(() => {
        if (!loadedRef.current && isInitialCheckComplete) {
            getMenu();
            getRecommendedKeyword();
        }
    }, [loginUser.id, isInitialCheckComplete]);

    useEffect(() => {
        if (theRefreshUserInfo > 0) {
            reloadMenu();
        }
    }, [theRefreshUserInfo]);

    // 메뉴 강제 재조회 함수 (필요시)
    const reloadMenu = () => {
        loadedRef.current = false;
        setIsLoaded(false);
        getMenu();
    };

    return (
        <MenuContext.Provider value={{
            isLoading,
            isLoaded,
            menuData,
            recommendedKeyword: keywords,
            reloadMenu,
        }}>
            {children}
        </MenuContext.Provider>
    );
};

