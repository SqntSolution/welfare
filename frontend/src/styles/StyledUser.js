/**
 * @file StyledUser.js
 * @description 사용자 공통 커스텀 컴포넌트
 * @author 김단아
 * @since 2025-04-15 11:34
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-04-15 11:34    김단아       최초 생성
 **/

import styled, { css } from "styled-components";
import { mediaWidth, SFEm, SFMedia } from "./StyledFuntion";
import { Flex, Input, Pagination, Row, Table, Tabs } from "antd";
import { isEmptyCheck } from "utils/helpers";
import { SIPdf } from "./StyledIcon";
import { LuSearch } from "react-icons/lu";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";


export const SUInner1440 = styled.div`
    &{
        max-width: 1440px;
        padding: 0 32px;
        width: 96%;
        margin: 0 auto;
    }
    ${SFMedia('pc-m', css`
        max-width: 1280px;
        padding: 0 32px;
        width: 100%;
    `)};
    ${SFMedia('mo-l', css`
        padding: 0 16px;
    `)};
`;
export const SUInner1280 = styled.div.attrs({ className: 'inner-1280' })`
    &{
        max-width: 1280px;
        padding: 0 32px;
        width: 100%;
        margin: 0 auto;
    }
    ${SFMedia('mo-l', css`
        padding: 0 16px;
    `)};
`;
export const SUText72 = styled.p.attrs({ className: 'text-72' })`
    font-weight: ${(props) => (props.$weight ? props.$weight : '700')};
    font-size: ${SFEm(72)};
    line-height: ${90 / 72};
    letter-spacing: -2%;
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;
export const SUText60 = styled.p.attrs({ className: 'text-60' })`
    font-weight: ${(props) => (props.$weight ? props.$weight : '700')};
    font-size: ${SFEm(60)};
    line-height: ${72 / 60};
    letter-spacing: -2%;
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
    
`;
export const SUText48 = styled.p.attrs({ className: 'text-48' })`
    font-weight: ${(props) => (props.$weight ? props.$weight : '700')};
    font-size: ${SFEm(48)};
    line-height: ${60 / 48};
    letter-spacing: -2%;
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
   
`;


export const SUText36 = styled.p.attrs({ className: 'text-36' })`
    font-size: ${SFEm(36)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '700')};
    line-height: ${44 / 36};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
    
`;
export const SUText30 = styled.p.attrs({ className: 'text-30' })`
    font-size: ${SFEm(30)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '600')};
    line-height: 1.2666666667;
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
   
`;
export const SUText24 = styled.p.attrs({ className: 'text-24' })`
    font-size: ${SFEm(24)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '600')};
    line-height: ${31 / 24};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
   
`;
export const SUText20 = styled.p.attrs({ className: 'text-20' })`
    font-size: ${SFEm(20)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '400')};
    line-height: ${20 / 20};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;
export const SUText18 = styled.p.attrs({ className: 'text-18' })`
    font-size: ${SFEm(18)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '400')};
    line-height: ${28 / 18};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;
export const SUText16 = styled.p.attrs({ className: 'text-16' })`
    font-size: ${SFEm(16)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '400')};
    line-height: ${24 / 16};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;
export const SUText14 = styled.p.attrs({ className: 'text-14' })`
    font-size: ${SFEm(14)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '400')};
    line-height: ${20 / 14};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;
export const SUText12 = styled.p.attrs({ className: 'text-12' })`
    font-size: ${SFEm(12)};
    font-weight: ${(props) => (props.$weight ? props.$weight : '400')};
    line-height: ${18 / 12};
    color: ${(props) => (props.$color ? props.$color : '#181D27')};
`;


export const SUPointText = styled(SUText16)`
    font-size: ${SFEm(16)};
    font-weight: 600;
    color: var(--color-primary);
    line-height: ${24 / 16};
    ${SFMedia('pc-s', css`
        &{font-size: ${SFEm(14)}}
    `)}
`;
export const SUSectionText = styled.div`
    font-size: ${SFEm(20)};
    line-height: 1;
    color: var(--color-tertiary);
    line-height: ${30 / 20};
    font-weight: normal;
    color: #181D27;
    ${SFMedia('pc-s', css`
        &{font-size: ${SFEm(18)}}
    `)}
`;

export const SUSectionHeader = styled.div`
    display: flex;
    gap: ${SFEm(12)};
    flex-wrap: wrap;
    padding: ${SFEm(96)} 0;
    & > *{
        width: 100%;
    }
    &:last-child{
        &{font-size: ${SFEm(10)}}
    }
`;

export const SUVarDiv = styled.div`
    --gap:  ${SFEm(96, 16)};
${SFMedia('tab-s', css`
    --gap:  ${SFEm(45)};
`)};
`;
/**
 * @name 엔트디 텝 버튼 공통 함수
 * @description 엔트디 텝 버튼 스타일 공통 함수이며 안에 컨텐츠는 각 페이지에서 커스텀 필요
 * @author 김단아
 * @since 2025-06-02 13:47
 * 
 * @param {*} v 
 * @returns 
 */

export const SUTabsBtnStyle = styled(Tabs)`
    &{
        font-size: 16px;
    }

    &.ant-tabs-top >.ant-tabs-nav::before{
        display: none;
    }
    
    .ant-tabs-nav-list{
        padding: 4px;
        border: 1px solid #E9EAEB;
        border-radius: ${SFEm(10)};
        overflow: hidden;
        background-color: #F5F5F5;
    }
    &.ant-tabs .ant-tabs-tab{
        margin: 0;
        font-size: 1em;
        padding: ${SFEm(9, 16)} ${SFEm(12, 16)};
        z-index: 2;
    }
    &.ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
        color: #414651;
    }
    &.ant-tabs .ant-tabs-ink-bar{
        height: calc(100% - 8px);
        bottom: 4px; 
        background-color: #fff !important;
        border-radius:  ${SFEm(6, 16)} ;
        z-index: 1;
        box-shadow: 0px 1px 3px 0px rgba(10, 13, 18, 0.1);
    }

${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(16px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;

const paginationFontSize = 14;
export const SUPaginationStyled = styled(Pagination)`

    &.ant-pagination{
        position: relative;
        margin-top: ${SFEm(64, 16)};
        border: 1px solid #D5D7DA;
        border-radius:${SFEm(8, 16)};
        width: fit-content;
        margin: ${SFEm(12, 16)} auto 0 ;
        align-items: center;
        overflow: hidden;
    }
    &.ant-pagination .ant-pagination-item,
    &.ant-pagination .ant-pagination-jump-next,
    &.ant-pagination .ant-pagination-jump-prev{
        width:${SFEm(40, paginationFontSize)};
        height: ${SFEm(40, paginationFontSize)};
        font-size: ${SFEm(paginationFontSize, paginationFontSize)};
        border-radius: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        border-right: 1px solid #D5D7DA;
        border-radius: 0;
        margin-inline-end: 0;
        font-weight: 500;
        overflow: hidden;
    }
    &.ant-pagination .ant-pagination-item a{
        color: #414651;

    }
    &.ant-pagination .ant-pagination-jump-next a,
    .ant-pagination-item-container,
    &.ant-pagination .ant-pagination-jump-prev{
        display: flex;
        width: ${SFEm(40, 12)};
        justify-content: center;
        
    }
    &.ant-pagination .ant-pagination-jump-prev,
    &.ant-pagination .ant-pagination-prev{
        margin: 0;
        border-right: 1px solid #D5D7DA;
        border-radius: 0;
        height: ${SFEm(40, 14)};
    }

    &.ant-pagination .ant-pagination-item-active{
        border-top: 0;
        border-left: 0;
        border-bottom: 0;
        background-color: #FAFAFA;
        color: #252B37;
    }
    &.ant-pagination .ant-pagination-item-active a{color: inherit;}
    .ant-pagination-disabled > * {
        opacity: 0.3 !important;
    }
    .btn-arrow{
       height: 100%;
       gap: 8px; 
       padding: ${SFEm(10, paginationFontSize)} ${SFEm(16, paginationFontSize)};
       overflow: hidden;

       &:hover{
        background-color: #FAFAFA;
       }
       svg{
        color: #A4A7AE;
       }
    }
    &.ant-pagination .ant-pagination-prev, 
    &.ant-pagination .ant-pagination-next{
        height:${SFEm(40, 14)};

    }
${SFMedia('mo-l', css`
    &.ant-pagination{
        font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    }
`)};
`;

export const SUPaginationWithArrows = (props) => {
    return (
        <SUPaginationStyled
            itemRender={(page, type, originalElement) => {
                if (type === 'prev') {
                    return <Flex align='center' className='btn-arrow prev'><FaArrowLeft /> 이전</Flex>;
                }
                if (type === 'next') {
                    return <Flex align='center' className='btn-arrow next'>다음 <FaArrowRight /></Flex>;
                }
                return originalElement;
            }}
            {...props}
        />
    )
}


export const SUBadge = styled.span.attrs({ className: 'badge' })`
    display: inline-block;
    padding: 2px 8px;
    margin-top:  ${SFEm(8, 12)};;
    margin-bottom: -5px;
    border:  ${(props) => (props.$border ? props.$border : '1px solid  #FFE8C2')} ;
    background-color: ${(props) => (props.$bgColor ? props.$bgColor : '#FFF8EE ')};
    border-radius:  ${SFEm(16, 12)};;
    overflow: hidden;
    font-size:  ${SFEm(12, 16)};;
    font-weight: 500;
    line-height: ${18 / 12};
    color: ${(props) => (props.$color ? props.$color : 'var(--color-primary)')} ;
`;


export const SUSearchInput = styled(Input.Search).attrs({ className: 'input-search' })`
    &{
        max-width: ${SFEm(320, 14)};
        width: 100%;
        height: ${SFEm(40, 14)};
        font-size: ${SFEm(14)};
        padding-bottom: 3px;
        box-shadow: none;
    }
    &:focus-within,
    &:focus-visible,
    &:hover {
        input{
            border: 1px solid var(--color-primary) !important;
            z-index: 1 !important;
        }
    }
    .ant-input-wrapper,
    .ant-input-group-addon ,
    .ant-btn,
    .ant-input {
        height: inherit;
        box-shadow: none;
    }

    .ant-input{
        border-radius: ${SFEm(8, 14)};
    }
    .ant-btn{
        width: ${SFEm(40, 14)};
        padding: 0;
        background-color: #fff;
        border: 1px solid #D5D7DA;
        color: #A4A7AE;
        &:hover{
            border-color : var(--color-primary) ;
        }
        svg {
            font-size: ${SFEm(20, 14)};
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    &,[class|= ant]{font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
`)};
`;

export const SUSearchInputFilter = (props) => {
    return (
        <SUSearchInput
            enterButton={<LuSearch className='input-icon' />}
            {...props}
        />
    )
}


export const SUBoardHeader = ({ title, description }) => {
    return (
        <BoardHeaderStyled>
            <p className="title">{title}</p>
            <p className="description">{description}</p>
        </BoardHeaderStyled>
    )
};

const BoardHeaderStyled = styled.div.attrs({ className: 'board-header' })`
    margin-bottom: ${SFEm(24)};

    .title {
        font-size:${SFEm(18)};
        font-weight: 600;
        line-height: ${28 / 18};
    }
    .description {
        font-size:${SFEm(14)};
        color:  var(--color-tertiary);
        font-weight: 400;
    }
${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;


export const SUBoardHeaderWrap = styled.div.attrs({ className: 'board-headerWrap' })`
    display: flex;
    justify-content: space-between;
    gap: ${SFEm(24)};
    margin-bottom:${SFEm(24)};
    .board-header{margin-bottom: 0}
    .my-select{
        width: ${SFEm(140, 14)};
        height: ${SFEm(40, 14)};
    }
    ${SFMedia('mo-l', css`
        /* display: flex; */
        
        flex-wrap: wrap;
        margin-bottom: ${SFEm(24)};
        gap: ${SFEm(8)};
        .board-header{
            margin-bottom: 8px;
        }
    `)};
`;

export const SUTableTopRow = styled(Row)`
    min-height: ${SFEm(60)} ;
    .my-select,
    .ant-select{
        width: ${SFEm(360)};
        text-align: left;
        height: ${SFEm(40)};
    }
    .ant-select-single{
        height: ${SFEm(40)};
    }
`;


export const SUImg = ({ alt, imgPath }) => {
    return (
        <CustomImg>
            <img
                src={imgPath}
                alt={isEmptyCheck(alt) ? '' : alt}
            />
        </CustomImg>
    );
};


const CustomImg = styled.span.attrs({ className: 'custom-img' })`
    display: flex;
    border-radius: var(--border-radius-2xl);
    overflow: hidden;
    height: ${SFEm(258, 16)};

    background: url(/img/emptystate.png) center center no-repeat,#e1e1e1;
    background-size: cover;
    
    img{
        object-fit: cover;
        width: 100%;
    }
`;



export const SUDotList = ({ lists = [], children }) => {
    return (
        <DotList>
            {children || (
                <>
                    {lists.map((list, index) => (
                        <li className="dot-list-li" key={`${list}-${index}`}>
                            {list}
                        </li>
                    ))}
                </>
            )}
        </DotList>
    )
}
const DotList = styled.ul.attrs({ className: 'dot-list' })`
    &{font-size: 1em}
  &-li, li {
    position: relative;
    font-size: ${SFEm(18)};
    line-height: ${28 / 18};
    font-weight: 500;
    padding-left: ${SFEm(14, 18)};
    color: #535862;

    &::before {
      content: '';
      display: block;
      min-width: 3px;
      max-width: ${SFEm(4, 18)};
      max-height : ${SFEm(4, 18)};
      aspect-ratio: 1 / 1;
      background-color: currentColor;
      border-radius: 50%;
      position: absolute;
      top: ${SFEm(12, 18)};
      left: 0;
    }
  }

${SFMedia('mo-l', css`
    font-size:  clamp(11px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};
`;


export const SUFileDownload = (props) => {
    return (
        <FileDownload>
            <div className='icon'
                title={props?.title}
            >{props?.icon ? props.icon : <SIPdf />}</div>
            <div className="text-box">
                <p style={{ maxWidth: props?.maxWidth }} title={props?.title}>{props?.title} </p>
                <p>다운로드 : {props?.download}회</p>
            </div>
        </FileDownload >
    )
};

const FileDownload = styled.div.attrs({ className: 'file-download' })`
    display: flex;
    align-items: center;
    text-align: left;
    gap: ${SFEm(12)};
    .icon{
        font-size: ${SFEm(40)};
    }
    .text-box{
        width: ${(props) => props.$maxWidth ? props.$maxWidth : SFEm(220)};
        p{
            width: 90%;
            font-size : ${SFEm(14)};
            color: #181D27;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
    }
        p:last-child{
            color: #535862;
            font-weight: 400;
        }
    }
`;


export const SUGrid3Col = styled.div.attrs({ className: 'grid' })`
    font-size: 16px;
    &{
        display: grid;
        grid-template-columns: repeat(3,1fr);
        gap: ${SFEm(48)} ${SFEm(24)};
        & > div{
            min-width: 0;
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('tab-m', css`
    &{
        grid-template-columns: repeat(2,1fr);
    }
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
`)};

${SFMedia('mo-s', css`
    &{
        grid-template-columns: repeat(1,1fr);
    }
`)};

`;

export const DetailHeader = styled.div`
    display: flex;
    flex-wrap: ${(props) => props.$wrap ? props.$wrap : 'nowrap'};
    gap: ${SFEm(64)};
    font-size: 16px;
    margin-top: ${SFEm(16)};
    padding-bottom:${SFEm(45)};
    width: 100%;
    .custom-img{
        min-width: clamp(384px,${567 / (mediaWidth['pc-l'] - 1) * 100}vw, 567px);
        height: ${SFEm(384)};
    }
${SFMedia('tab-l', css`
    flex-wrap: wrap;
    gap: ${SFEm(24)};
    flex-direction: column-reverse;

    .custom-img{
        width: 100%;
    }
`)};
${SFMedia('mo-l', css`
    &,[class|= ant]{font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;}
    .crate-inner .ant-descriptions{
        max-width: min-content;
    }
    .ant-descriptions-view{
        width:max-content;
        margin-right: ${SFEm(12)};
    }
    .ant-descriptions .ant-descriptions-view table{
        width: max-content;
    }
    .ant-descriptions .ant-descriptions-item-container{
        align-items: center;
    }
    .ant-descriptions-item-label{
        padding: ${SFEm(8)} ${SFEm(12)} !important;
        align-items: center;
        /* min-width: ${SFEm(160)} !important; */
    }
    
`)};
`;


export const SUTabel = styled(Table)`
${SFMedia('tab-l', css`
    [class |= ant]{
       font-size: 12px;
    }
    &.ant-table-wrapper .ant-table-tbody>tr>td{
        padding: 4px 16px;
    }
`)};

`;