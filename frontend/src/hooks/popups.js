import { Modal } from 'antd';

/*
confirm 팝업과, info 팝업 

(사용법)
import { useConfirmPopup, useInfoPopup } from 'hooks/popups'

    const [confirm, confirmContextHolder] = useConfirmPopup();
    const [info, infoContextHolder] = useInfoPopup();

        <>{confirmContextHolder}</>
        <>{infoContextHolder}</>

        <Button onClick={()=> confirm("진짜로 진행하시겠습니까?", ()=>console.log("=== ok 클릭함."))}>confirm 팝업</Button>
        <Button onClick={()=> info('잘 끝났습니다.')}>info 팝업</Button>

*/
export const useConfirmPopup = () => {
    const [modal, confirmContextHolder] = Modal.useModal();
    const confirm = (msg, onOk, onCancel=()=>{}) => modal.confirm({
        // title: '타이틀 !',
        content: (
            <>
                {msg}
            </>
        ),
        onOk:onOk,
        onCancel:onCancel,
        // closable: 'true',
        okText:"예",
        cancelText:"아니오",
        transitionName: '',
        maskTransitionName: ''
        
    })
    return [confirm, confirmContextHolder]
}

export const useConfirmPopupDangerousAddCancel = () => {
  const [modal, confirmContextHolder] = Modal.useModal()
  const confirm = (title, msg, onOk, onCancel, okText = '예', cancelText = '아니오' ) => modal.confirm({
      title: title ?? '',
      content: (
          <>
            <div dangerouslySetInnerHTML={ {__html: msg} }></div>
          </>
      ),
      onOk: onOk,
      onCancel: onCancel,
      // closable: 'true',
      okText: okText,
      cancelText: cancelText,
      transitionName: '',
      maskTransitionName: ''
      
  })
  return [confirm, confirmContextHolder]
}

export const useInfoPopup = () => {
    const [modal, infoContextHolder] = Modal.useModal();
    const info = (msg) => modal.info({
        // title: '타이틀 !',
        // closable: 'true',
        content: (
            <>
                {msg}
            </>
        ),
        transitionName: '',
        maskTransitionName: ''
    })
    return [info, infoContextHolder]
}

export const useInfoPopup2 = () => {
    const [modal, infoContextHolder] = Modal.useModal();
    const info = (msg) => modal.info({
        // title: '타이틀 !',
        // closable: 'false',
        content: (
            <>
                <div dangerouslySetInnerHTML={ {__html: msg} }></div>
            </>
        ),
        transitionName: '',
        maskTransitionName: ''
    })
    return [info, infoContextHolder]
}

export const useInfoPopupOkButton = () => {
  const [modal, infoContextHolder] = Modal.useModal();
  const info = (msg, onOk) => modal.info({
      // title: '타이틀 !',
      content: (
          <>
              {msg}
          </>
      ),
      // closable: 'true',
      onOk: onOk,
      okText: "확인",
      transitionName: '',
      maskTransitionName: ''
  })
  return [info, infoContextHolder]
}

export const useInfoPopupOkButton2 = () => {
  const [modal, infoContextHolder] = Modal.useModal();
  const info = (msg, onOk, width=416) => 
      modal.info({
      // title: '타이틀 !',
      content: (
          <>
              <div dangerouslySetInnerHTML={ {__html: msg} }></div>
          </>
      ),
      // closable: 'true',
      onOk: onOk,
      okText: "확인",
      transitionName: '',
      maskTransitionName: '',
      width: width,
  })
    
  return [info, infoContextHolder]
}

