/* recoil에 저장해 놓은 로그인 사용자 정보를 얻어옴.

(사용법)
import {useUserInfo} from 'hooks/useUserInfo'

    const userInfo = useUserInfo()
    console.log("=== userInfo : ", userInfo);

(userInfo에 들어가 있는 데이타)
{
    "v": "local",
    "id": "112190028",
    "name": "다자아",
    "email": "wwwww@cosmax.com",
    "phone": "",
    "teamCode": "D0167",
    "teamName": "IT기획팀",
    "role": "ROLE_MASTER",
    "contentsManagerAuthMenuNames": [['market-analysis','local'], ['strategy', 'trend']],
    "strategicMarketingGroupYn": true,
    "popups" : {"market-analysis": [{menuId: 0, menuPath: "market-analysis", popupId: 18}, {menuId: 0, menuPath: "market-analysis", popupId: 24},…],…},
}

*/
import { loginUser } from "atoms/atom";
import { useRecoilValue } from "recoil";
export const useUserInfo = () => {
    const theLoginuser = useRecoilValue(loginUser);
    return theLoginuser;
}
