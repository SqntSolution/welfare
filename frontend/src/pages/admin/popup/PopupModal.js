import { useEffect } from 'react';
import { Modal, Flex, Button, Checkbox } from "antd";
import { TheCkeditor } from 'components/common/TheCkeditor';
import styled from 'styled-components';
import { SFEm } from 'styles/StyledFuntion';

export const PopupModal = (props) => {

    const { open, setOpen, textData, id, type, title = "PREVIEW", index = 0 } = props
    // const [check, setCheck] = useState(false);

    useEffect(() => {
        if (open && id && type !== 'preview') {
            let test = getCookie(`popup${id}`);
        }
    }, [open]);


    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const setCookie = () => {
        const now = new Date();
        const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 현재 시간에 일주일을 더한 시간
        const expires = oneWeekLater.toUTCString(); // 만료일을 문자열로 변환
        document.cookie = `popupIds_${id}=${id}; hidePopup=true; expires=${expires}; path=/`;
    }


    const handleHideForAWeek = (persistent) => {
        if (persistent === true && type !== 'preview') { // 일주일간 다시보지않기 체크박스 체크 및 사용의경우
            setCookie();
        }
        setOpen?.(false);
    }

    return (
        <PopupModalBox
            title={<span className='popup-title'>{title}</span>}
            style={{
                top: (index + 1) * 45,
                left: index * 20,
            }}
            mask={index === 0}
            open={open}
            onOk={() => handleHideForAWeek()}
            onCancel={() => handleHideForAWeek()}
            okButtonProps={{
                style: { display: 'none' }
            }}
            cancelButtonProps={{
                style: { display: 'none' }
            }} >
            <div className='popup-inner'>
                <div className='popup-editor' >
                    <TheCkeditor
                        data={textData}
                        readonly={true}
                        borderColor={'transparent'}
                    >
                    </TheCkeditor>
                </div>
                {/* <div dangerouslySetInnerHTML={{ __html: data?.contents }} /> */}
                <Flex justify='space-between' align='center' className='popup-footer'>
                    <Checkbox onClick={() => handleHideForAWeek(true)} style={{ lineHeight: 1 }}>
                        일주일간 보지 않기
                    </Checkbox>
                    <Button type='primary' onClick={handleHideForAWeek}>
                        닫기
                    </Button>
                </Flex>
            </div>
        </PopupModalBox>
    );
}

const PopupModalBox = styled(Modal)`
    &{
        width: ${SFEm(400)} !important;
        box-sizing: border-box;
    }
    .ant-modal-content{
        padding: 0;
    }
    .ant-modal-header{
        height: ${SFEm(52)};
        display: flex;
        align-items: center;
        padding:${SFEm(10)} ${SFEm(24)};
        border-bottom: 1px solid #ededed;
    }
    .ant-modal-close{
        top: ${SFEm(8)}
    }
    .popup-editor{
        padding:${SFEm(10)} ${SFEm(24)};
        height: ${SFEm(450)} ;
        overflow: auto;
        box-sizing: border-box;
    }
    .popup-footer{
        padding:${SFEm(10)} ${SFEm(24)};
        border-top: 1px solid #ededed;
    }

    img{max-width:100%; max-height: 100%; width:auto; height: auto; }
    .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){padding:0;}

`;