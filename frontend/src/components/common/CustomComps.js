/**
 * @formatter
 */


import { useState } from 'react';
import { Divider, Typography, Drawer, Row, Col, Card, Button, Badge, Breadcrumb, Menu } from 'antd';
import { EyeOutlined, LikeOutlined, LikeFilled, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { BookMarkFill, BookMarkLine } from './IconComponets';
import { AXIOS } from 'utils/axios';
import { useMsg } from 'hooks/helperHook';
import { NavLink } from 'react-router-dom';


const { Text } = Typography;
const { Ribbon } = Badge;

export const SubTitleDivider = (props) => {
    return (
        <Divider {...props} style={{ height: '1px', backgroundColor: 'rgba(0, 128, 128, 0.8)', margin: '16px', marginLeft: '1px' }} />
    );
}

export const TableTotalCount = (props) => {
    const { totalCount, fontSize, color } = props;

    return (
        <Text strong style={{ fontSize: 16 }}>전체&nbsp;<Text strong style={{ fontSize: fontSize ?? 16, color: color ?? 'rgba(230, 46, 0, 0.8)' }}>{totalCount ?? 0}</Text>건</Text>
    );
};




export const ErrorMsg = ({ msg }) => {
    return (
        <Typography.Text type='danger'>{msg ?? ''}</Typography.Text>
    )
}

/**
 * FormItem 테이블 형식으로 그릴때 Row
 * @param {*} props width
 * @returns 
 */
export const CustomFormRow = (props) => {
    const { width, border, borderRadius, marginBottom, marginTop } = props;

    const styleProps = {
        width: width,
        border: border ? (border == 'none' ? null : border) : '1px solid #fffffff8',
        boderRadius: borderRadius ? (borderRadius == 'none' ? null : borderRadius) : '2px',
        margin: 0,
        marginBottom: marginBottom ? (marginBottom == 'none' ? null : marginBottom) : '10px',
        marginTop: marginTop ? (marginTop == 'none' ? null : marginTop) : '10px',
    }

    return (<Row gutter={24} style={{ ...styleProps }} >
        {props.children}
    </Row>);
};

/**
 * @ FormItem 테이블 형식으로 그릴때 Label Column
 * @param {*} props label, span, required
 * @returns 
 */
export const CustomFormColLabel = (props) => {
    const { label, span, borderRight, fontWeight, display, required, background, borderBottom, padding, alignItems } = props;

    const styleProps = {
        background: background ? (background == 'none' ? null : background) : '#5e5e5e75',
        borderRight: borderRight ? (borderRight == 'none' ? null : borderRight) : '1px solid #f0f0f0',
        borderBottom: borderBottom ? (borderBottom == 'none' ? null : borderBottom) : '1px solid #e7e6e69d',
        fontWeight: fontWeight ? (fontWeight == 'none' ? null : fontWeight) : 'bold',
        padding: padding ? (padding == 'none' ? null : padding) : '0 5px',
        display: display ? (display == 'none' ? null : display) : 'flex',
        alignItems: alignItems ? (alignItems == 'none' ? null : alignItems) : 'center'
    };

    return (
        <Col span={span} style={{ ...styleProps }}>
            {required ? <span style={{ color: 'red' }}>*</span> : <span>&nbsp;</span>}&nbsp;<span>{label}</span>
        </Col>
    );
};

/**
 * @ FormItem 테이블 형식으로 그릴때 Content Column, validation message wrap없이 표시-> wrapperCol={24} 
 * @ Form.Item에 noStyle={true}를 넣으면 error message가 안나옴. 
 * @param {*} props span
 * @returns 
 */
export const CustomFormColContent = (props) => {
    const { span, background, borderRight, borderBottom, fontWeight, padding, margin, display, alignItems } = props;


    const styleProps = {
        background: background ? (background == 'none' ? null : background) : '#d3d7dd39',
        borderRight: borderRight ? (borderRight == 'none' ? null : borderRight) : '1px solid #f0f0f0',
        borderBottom: borderBottom ? (borderBottom == 'none' ? null : borderBottom) : '1px solid #f0f0f0',
        fontWeight: fontWeight ? (fontWeight == 'none' ? null : fontWeight) : 'bold',
        padding: padding ? (padding == 'none' ? null : padding) : '5px 5px 0px 5px',
        margin: margin ? (margin == 'none' ? null : margin) : 0,
        display: display ? (display == 'none' ? null : display) : 'flex',
        alignItems: alignItems ? (alignItems == 'none' ? null : alignItems) : 'center'
    };

    return (
        <Col span={span} style={{ ...styleProps }}>
            {props.children}
        </Col>
    );
};


export const CustomCardMeta = (props) => {
    return (
        <>
            <Card.Meta style={{ height: '160px', padding: '16px 24px', position: 'relative' }}
                className='cardMeta'
                title={
                    <Typography.Text
                        // ellipsis={{ rows: 2, expandable: true }}
                        style={{
                            maxHeight: '3em',
                            fontSize: '16px',
                            lineHeight: '24px',
                            whiteSpace: 'break-spaces',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: '2',
                            fontWeight: 'bold',
                        }}
                    >
                        {props.title}
                    </Typography.Text>
                }
                description={
                    <>
                        <Typography.Text
                            // ellipsis={{rows: 2, expandable: true }}
                            style={{
                                display: 'block',
                                height: '3em',
                                fontSize: '14px',
                                fontWeight: '400',
                                lineHeight: '22px',
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: '2',
                                marginTop: 8
                            }}
                        >
                            {props.description}
                        </Typography.Text>
                        <Typography.Text style={{ fontSize: 12, color: '#8C8C8C', position: "absolute", left: 24, bottom: 16 }}>
                            {props.date}
                        </Typography.Text>
                    </>
                }
            />
        </>
    )
}

export const CustomBoardInfoIcon = (props) => {
    const postId = props?.postId
    const { error, info } = useMsg()
    const [likes, setLikes] = useState(props?.likes)
    const [scrapes, setScrapes] = useState(props?.scrapes)
    const [likesCnt, setLikesCnt] = useState(props?.likesCnt)

    const requestLike = () => {
        // console.log("=== requestLike")
        if (postId == null) {
            console.log("postId가 null")
            return
        }
        AXIOS.post(`/api/v1/common/like/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== like : ", data)
                setLikes(data?.result === true)
                setLikesCnt(data?.result2 ?? '')
                info((data?.result === true) ? "'좋아요' 했습니다." : "'좋아요'를 해제했습니다.")
                // refreshPostInfo()
            })
            .catch((err) => {
                console.log('=== requestLike 에러 : ', err?.response);
                error(err)
            })
    };

    const requestScrap = () => {
        if (postId == null) {
            console.log("postId가 null")
            return
        }
        AXIOS.post(`/api/v1/common/scrap/${postId}`)
            .then((resp) => {
                const data = resp?.data
                // console.log("=== scrap : ", data)
                setScrapes(data?.result === true)
                info((data?.result === true) ? "'스크랩'했습니다." : "'스크랩'을 해제했습니다.")
            })
            .catch((err) => {
                console.log('=== requestScrap 에러 : ', err?.response);
                error(err)
            })
    };

    // onClick={(e)=>{console.log("== 클릭함.");e.stopPropagation()}}
    return (
        <>
            <div className='boardInfo-icon' style={{ overflow: 'hidden', color: '#8C8C8C', fontSize: '16px' }}>
                {/* like */}
                <StyledCustomBoardInfoIcon
                    style={{ display: 'inline-flex', alignItems: 'center', marginRight: '24px', float: 'left', }}
                    onClick={(e) => { requestLike(); e.stopPropagation() }}
                    title="좋아요"
                >
                    {
                        likes ? (
                            <><LikeFilled /> <span style={{ paddingLeft: '8px' }}>{likesCnt ?? ''}</span></>
                        ) : (
                            <><LikeOutlined /> <span style={{ paddingLeft: '8px' }}>{likesCnt ?? ''}</span></>
                        )
                    }
                </StyledCustomBoardInfoIcon>
                {/* view */}
                <div style={{ display: 'inline-flex', alignItems: 'center', float: 'left' }}>
                    <EyeOutlined /> <span style={{ paddingLeft: '8px' }}>{props.viewCnt ?? 0}</span>
                </div>
                <StyledCustomBoardInfoIcon style={{ display: 'inline-flex', alignItems: 'center', float: 'right', paddingLeft: '10px', paddingTop: 2 }}
                    onClick={(e) => { requestScrap(); e.stopPropagation() }}
                    title="scrap"
                >
                    {
                        scrapes ? (
                            <BookMarkFill />
                        ) : (
                            <BookMarkLine />
                        )
                    }
                </StyledCustomBoardInfoIcon>
            </div>
        </>
    )

};
const StyledCustomBoardInfoIcon = styled.div`
    &:hover{
        color:rgb(234, 29, 34);
    }
    &:hover svg path{
        fill :rgb(234, 29, 34);
    }
`;


export const CustomTag = (props) => {
    const { strategicMarketingOnly, menuName, color } = props;

    return (
        <>
            <StyledBadgeRibbon
                // opacity={props.opacity}
                text={menuName}
                color={props.strategicMarketingOnly ? "#EA1D22" : "#000"}
                placement='start'
                style={{ fontSize: '14px', borderRadius: '2px', border: 0, padding: '1px 8px 2px' }}
            ></StyledBadgeRibbon>

            {/* <StyledTag color={props.strategicMarketingOnly ? "#F5222D" : "#0372D8"} >
                {props.menuName}
            </StyledTag> */}
        </>
    );
};


const StyledBadgeRibbon = styled(Ribbon)`
    .ant-ribbon-corner{
        // background-color: #fafafa;
        opacity: ${(props) => props.opacity};
    }
`;




export const CustomFilterLabel = (props) => {
    return (
        <Col span={24} style={{ padding: 0, color: 'rgba(0, 0, 0, 0.85)', fontSize: 16, fontWidth: 500, marginBottom: 8 }}>{props.name}</Col>
    )
};


export const CustomTitle = (props) => {
    return (
        <Typography.Title level={2} style={props.style ? props.style : titleStle}>{props?.title}</Typography.Title>
    );

}

const titleStle = {
    lheight: 'auto',
    fontSize: '30px',
    fontWeight: '700',
    lineHeight: '40px',
    marginTop: '20px',
    marginBottom: '20px',
    padding: '0px',
    textAlign: 'left'
}

export const CustomSearchInput = styled(Col)`
    &{border: 1px solid #d9d9d9; border-radius: 2px;}
    &:hover, &:focus-within, &:focus-visible {border-color: #EB2D2B}
    & .ant-select:not(.ant-select-customize-input) .ant-select-selector{border:0; box-shadow: none !important;    outline: none;}
    .ant-select-selector{padding-left: 2px; padding-right:60px;}
    &.ant-select-multiple.ant-select-show-arrow .ant-select-selector,
    &.ant-select-multiple.ant-select-allow-clear .ant-select-selector{padding-right:60px}
    .ant-select .ant-select-arrow{display:none}
    .ant-select-selection-placeholder{text-align:left;color:#BFBFBF;}
    .ant-btn.ant-btn-icon-only{position:absolute;top:0;right:12px;background:none; width: 24px; box-shadow: none;}
    .ant-btn-primary{color:#262626; font-size: 16px;}
    .ant-btn.ant-btn-icon-only:hover{background:none; color: #EB2D2B;}
    .ant-select .ant-select-clear{inset-inline-end: 40px;}

`;



// 관리자에만 해당하는 컴포넌트 입니다.

export const CustomAdminTitle = (props) => {
    return (
        <div style={{ padding: '16px 24px 16px 0' }}>
            <Typography.Title level={4} >
                {props?.title}
            </Typography.Title>
            <div>
                <Breadcrumb items={props?.items} />
            </div>
        </div>
    );

}

export const CustomAdminCardTitle = (props) => {
    return (
        <Typography.Title level={5} >{props?.title} </Typography.Title>
    );
}


export const CustomAdminTabButton = (props) => {
    return (
        <Menu
            onClick={props.onClick}
            selectedKeys={props.selectedKeys}
            mode="horizontal"
            items={props.items}
            style={{
                background: 'transparent',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            }}
        />
    );
}

//버튼 레이블 속성 추가
export const CustomButtonExcel = (props) => {
    const { label } = props;

    return (
        <Button onClick={props?.onClick} type='primary' href={props?.href} style={{ minWidth: 123, background: '#389E0D', color: '#fff' }} icon={<DownloadOutlined />}>{label ? label : '엑셀 다운로드'}</Button>
    );
}

export const CustomNavLinkButton = (props) => {
    return (
        <>
            <NavLink
                to={props.to}
                state={props?.state}
                style={{ color: `${props.text === '수정' ? 'rgba(64, 169, 255, 1)' : 'rgba(255, 77, 79, 1)'}` }}
            >
                <StyledCustomTableButton type='link'>{props.text}</StyledCustomTableButton>
            </NavLink>
        </>
    );
}

export const CustomTableButton = (props) => {
    return (
        <>
            <StyledCustomTableButton type='link' onClick={props.onClick !== null ? props.onClick : false}
                style={{ border: 0, color: `${props.color == null ? (props.text === '수정' ? 'rgba(64, 169, 255, 1)' : 'rgba(255, 77, 79, 1)') : props.color}` }}
            >{props.text}</StyledCustomTableButton>
        </>
    );
}
const StyledCustomTableButton = styled(Button)`
    &{padding:0;font-size:14px;height: 25px;}
    &:hover{opacity:0.7;}
`;