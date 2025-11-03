// 오른편에, 댓글
import { useEffect, useState } from 'react';
import { App, Space, Tag, Button, message, DatePicker, Flex, Row, Col, Input, Card, Typography, Popconfirm, Avatar } from 'antd';
import { AXIOS } from 'utils/axios';
import {
    ShareAltOutlined, StarFilled, LinkOutlined, CloseOutlined,
    SendOutlined
} from '@ant-design/icons';
import { coverImgStyle } from 'utils/helpers'
import { FileUpload } from 'components/common/FileUpload'
import { useLocation } from 'react-router-dom';
import { useUserInfo } from 'hooks/useUserInfo'
import { ErrorMsg } from 'components/common/CustomComps'
import { errorMsg } from 'utils/helpers';
import { useMsg } from 'hooks/helperHook';
import { WastebasketLine } from 'components/common/IconComponets';
import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

// const imgStyle = {
//     objectFit: "cover", margin: 'auto', width: '100%', height: '100%',
// }

export const PostRightSide_comments = ({ postId }) => {
    const [loading, setLoading] = useState(false)
    const { notification } = App.useApp();
    const location = useLocation();
    const userInfo = useUserInfo()
    const [comments, setComments] = useState([]) // 댓글들
    const [comment, setComment] = useState() // 입력댓글
    const [comment2, setComment2] = useState() // 입력댓글
    const { error, info } = useMsg()

    const onEnter = () => {
        console.log("=== 댓글 등록")
        if ((comment ?? "").trim() == '') {
            error("내용을 입력하세요.", 2)
            return
        }
        insertComment(0, comment)
    }

    useEffect(() => {
        getComments()
    }, [postId])

    // 댓글들 조회
    const getComments = () => {
        setLoading(true);
        AXIOS.get(`/api/v1/user/post/comment/${postId}`)
            .then((resp) => {
                const data = resp?.data ?? []
                // console.log("=== 1차 menus : ", data)
                setComments(data)
            })
            .catch((err) => {
                setComments([])
                console.log('=== getComments 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
            })
            .finally(() => setLoading(false));
    };

    // 댓글 등록
    const insertComment = (origSeq, commentParam) => {
        const param = {}
        param.postId = postId
        param.origSeq = origSeq
        param.comment = commentParam

        // info(commentParam)
        // info( (commentParam ?? '') == '' )
        if( (commentParam??'') == ''){
            error("내용을 입력하세요.")
            return false
        }
        // if(commentParam==null){
        // }else{
        //     param.comment = commentParam
        // }
        setLoading(true)
        AXIOS.post(`/api/v1/user/post/comment`, param)
            .then((resp) => {
                info("댓글을 등록하였습니다.", 2)
                // notification.info({ message: '댓글을 등록하였습니다.', placement: 'topRight', duration: 4 });
                // 댓글 다시 조회
                getComments()
                setComment(null)
                setComment2(null)
            })
            .catch((err) => {
                console.log('=== insertComment 에러 : ', err?.response);
                error(err)
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
            })
            .finally(() => setLoading(false));
    };

    // 댓글 삭제
    const deleteComment = (commentId) => {
        setLoading(true)
        AXIOS.delete(`/api/v1/user/post/comment/${commentId}`)
            .then((resp) => {
                // notification.info({ message: '댓글을 삭제하였습니다.', placement: 'topRight', duration: 4 });
                info('댓글을 삭제하였습니다.')
                // 댓글 다시 조회
                getComments()
                setComment(null)
            })
            .catch((err) => {
                console.log('=== insertComment 에러 : ', err?.response);
                // notification.error({ message: <ErrorMsg msg={errorMsg(err)} />, placement: 'top', duration: 4 });
                error(err)
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Row style={{
                width: '100%',
                backgroundColor: 'white',
            }} justify='center' align='middle' gutter={[2, 2]}
            >
                <Col span={24} style={{height:40, padding:'0 16px',color: 'rgba(0, 0, 0, 0.85)',fontSize: 16,fontWeight: 500,lineHeight:'40px'}} >
                    Comments
                </Col>
                <Col span={24} style={{borderRadius:2,overflow:'hidden'}}>
                    <Space.Compact style={{ width: '100%',height:40 }} >
                        <Input placeholder="댓글을 남겨주세요" onPressEnter={onEnter} value={comment} onChange={e => setComment(e.target.value)} allowClear size='small' 
                            style={{borderColor:'#D9D9D9'}}
                        />
                        <Button type="primary" style={{minWidth:50, height:'100%',padding:0,textAlign:'center'}} onClick={onEnter}>
                            <SendOutlined style={{fontSize: 18,marginRight:'-2px'}} />
                        </Button>
                    </Space.Compact>
                </Col>
                {
                    comments?.map(e => {
                        let prefix = null
                        if (e?.commentsLevel > 1) {
                            prefix = <span style={{background:'red'}}></span>
                        }

                        return <>
                            <Row style={{ width:`${prefix ? '80%' : '100%'}`,marginLeft:`${prefix ? 'auto' : '0'}`,borderBottom : '1px solid #F0F0F0',padding:'16px 0'}}>
                                {prefix}
                                <Col span={4} align='left' >
                                    <Avatar icon={<UserOutlined />} 
                                    // src={ (e?.avatarImgPath==null) ? null : (`/api/v1/image/${e?.avatarImgPath}`) } 
                                    src={e?.avatarImgPath ? `/api/v1/image/${e.avatarImgPath}` : null}
                                    />
                                </Col>
                                <Col span={20} align=''>
                                    <div style={{fontSize:12,height:20,lineHeight:'20px',marginBottom: 4}}>
                                        <span style={{ color: 'rgba(0, 0, 0, 0.45)',paddingRight:8 }}>{e?.userNm} </span>
                                        <span style={{color: '#BFBFBF'}}>{e?.createdAt?.substring(0,10)}</span>
                                    </div>
                                    <Row>
                                        <Col span={20} style={{ 
                                            color: `${e?.deleted ? '#BFBFBF' : 'rgba(0, 0, 0, 0.85)'}`, 
                                            wordBreak: 'break-all',
                                            fontSize:14
                                            }}>{e?.contents}</Col>
                                        <Col span={4} align="right">
                                            {userInfo?.id == e?.userId ? (
                                                < Popconfirm
                                                    title="댓글 삭제"
                                                    description="삭제하시겠습니까?"
                                                    onConfirm={() => deleteComment(e?.id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    {/* <CloseOutlined style={{ color: 'red' }} /> */}
                                                    <WastebaskeButton type="primary" shape="circle" size='small' > <WastebasketLine /></WastebaskeButton>
                                                </Popconfirm>)
                                                :
                                                null
                                            }
                                        </Col>
                                    </Row>

                                    {
                                        e?.commentsLevel > 1 ? (
                                            null
                                        ) : (
                                            <Popconfirm
                                                title="댓글 등록"
                                                description={<Input style={{ width: '400px' }} value={comment2} onChange={e => setComment2(e.target.value)} />}
                                                onConfirm={() => insertComment(e?.commentsSeq, comment2)}
                                                okText="Yes"
                                                cancelText="No"

                                            >
                                                <Button size='small' type='text' style={{color:'rgba(0, 0, 0, 0.45)',fontSize:12, marginTop: 12}}>Reply to</Button>
                                            </Popconfirm>
                                        )
                                    }
                                </Col>

                            </Row >
                        </>
                    })
                }
            </Row >

        </>
    )
}

/*
    {
        "id": 10,
        "contents": "ㅎㅎㅎㅎㅎㅎ",
        "commentsSeq": 8000,
        "commentsLevel": 1,
        "deleted": false,
        "userNm": "나마바",
        "userId": "112190010",
        "postId": 96,
        "createdAt": "2023-01-11 11:20",
        "createdUserId": "112190010",
        "createdUserNm": "나마바",
        "modifiedAt": "2023-01-11 11:20",
        "modifiedUserId": "112190010",
        "modifiedUserNm": "나마바"
    },
*/

const WastebaskeButton = styled(Button)`
    &:hover > svg > path{fill:#fff;}
`;