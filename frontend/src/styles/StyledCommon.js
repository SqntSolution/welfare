/**
 * @file StyledCommon.js
 * @description 모든 페이지 공통 스타일 커스텀 컴포넌트
 * @author 김단아
 * @since 2025-04-15 11:34
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-04-15 11:34    김단아       최초 생성
 **/

import styled from 'styled-components';
import { Table, Form, Col, Button } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import Search from 'antd/es/input/Search';


export const UserNoti = styled.dl`
  margin-bottom: 1px !important;
  dt{
    padding: 5px 0;
    border-bottom: 1px solid #E0E0E0;
    span{
      display: block;
    }
  }
  dd{
    margin-bottom: 0 !important;
    ul{
      padding-top: 2px;
      li{
        line-height: 2;
        .anticon{
          margin-right:3px;
          vertical-align: middle;
          color: #ccc;
        }
        .ant-btn{
          margin-top: 10px;
        }
      }
    }
  }
`;

export const StyledTable = styled(Table)`
  &&&{
    .ant-table-thead > tr > th {
      padding: 6px !important;
      height: 30px;
      font-size: 14px;
      color: #00008B;
      text-align: center !important;
      font-weight: 700;
      border-color: #666;
      background: rgba(128, 179, 255, 0.3);
      &:first-child{
        border-left: 0;
      }
    }

    .ant-table-tbody > tr > td {
      padding: 5px 12px;
      height: 40px;
      font-size: 14px;
      vertical-align: middle;
      background: rgba(250, 250, 250, 0.5);
      border-color:rgba(47, 79, 79, 0.5) !important;
    }

    && tbody > tr:hover > td {
      background: rgba(255, 140, 0, 0.2) !important;
    }
  }
`;


export const ColData = styled(Col)`
  border: 1px solid #dfdfdf;
  padding-left: 10px;
  line-height: 2em;
`;


export const ButtonText = styled(Button)`
  &&&:hover {background : transparent; color: #EB2D2B; }
  width: auto;
  background : transparent ; 
  padding :0; 
`;


export const InnerDiv = styled.div`
  width: 100%;
  max-width:1240px;
  margin :0 auto; 
`;

export const SComBtnHover = styled(Button)`
&{
  width: 79px;
  height: 30px;
  border-radius: 2px;
  border: 1px solid #D9D9D9;
  padding: 4px 10px;
  color: #262626;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;

}
  &:hover{
    border-color :#eb2d2b ;
    color :#eb2d2b;
  }
`;



// 관리자 스타일
export const InnerAdminDiv = styled.div`
  max-width:1664px; 
  width:calc(100% - 24px);
  padding: 24px;
  overflow: hidden;
  background:#fff;
  border-radius: 15px;
`;

export const StyledAdminTable = styled(Table)`
  &.ant-table-wrapper .ant-table{
    background: #fff;
  }
  .ant-table-title{display:none}
  && .ant-table-thead>tr>th{
    background:  rgba(250, 250, 250, 1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 8px;
    font-size: 14px;
    height: 40px;
    white-space: nowrap;
  }
  &.ant-card-small >.ant-card-body{padding:0}

  &.ant-table-wrapper .ant-table-tbody >tr >th, 
  &.ant-table-wrapper .ant-table-tbody >tr >td{
    padding: 8px;
    font-size: 14px;
    color:rgba(0, 0, 0, 0.85);
    height: 40px;
  }
  &.ant-table-wrapper .ant-table-tbody >tr >td > a{color:rgba(0, 0, 0, 0.85)}
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-title, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-footer, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-cell, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-thead>tr>th,
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>th, 
  &.ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td, 
  &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>th, 
  &.ant-table-wrapper .ant-table.ant-table-small tfoot>tr>td{padding:8px;}

  &.ant-table-wrapper .ant-table-pagination-right{    justify-content: center;}
`;

export const StyledButtonUnderLine = styled(Button)`
  &{
    margin: 0px;
    padding: 0px;
    height:auto;
  }
`;

export const StyledFormItem = styled(Form.Item)`
    .ant-col.ant-form-item-label{ min-width: 120px; }
    &.ant-form-item{margin-bottom: 8px; width: 100%; }
    .txt-box{
        margin:0; 
        height: 32px; 
        padding: 4px 12px ;
        border-radius: 6px ;
    }
    &.ant-form-item .ant-form-item-explain-error{font-size: 12px;margin-bottom:8px; margin-top:3px;}
`;

export const StyledTableButton = styled(Button)`
    &{padding:0;margin:0}
    &:hover{opacity:0.7;}
`;

export const StyledNavLink = styled(NavLink)`
   &&&&&{color:#1677ff ;}
   &&&&&:hover{opacity:0.7;}
`;

export const StyledSearch = styled(Search)`
    &&&  * { outline: none;   box-shadow: none !important;}
    &{border: 1px solid #d9d9d9; border-radius: 2px;overflow:hidden;height: 32px}
    &.ant-input-search >.ant-input-group >.ant-input-group-addon:last-child{background: #fff}
    &:hover, &:focus-within, &:focus-visible{border-color: red;}


    &.ant-input-search >.ant-input-group >.ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary){
        color: #262626;
        border:0;
        margin-right: 8px;
    }
    & .ant-input-group >.ant-input-affix-wrapper:not(:last-child) .ant-input{line-height:20px}
    &.ant-input-search >.ant-input-group >.ant-input-group-addon:last-child .ant-input-search-button:not(.ant-btn-primary):hover{
      color:#f75c54;
      border:0;
    }
    & .ant-select-multiple{ width:300px;}
    & .ant-select:not(.ant-select-customize-input) .ant-select-selector {border-right:0;}

    & .ant-input-group .ant-input-affix-wrapper {border:0;}
    & .ant-input-group .ant-input-affix-wrapper:hover  + .ant-input-group-addon .ant-input-search-button:not(.ant-btn-primary) {border-color:#d9d9d9  ;}

    &.ant-input-affix-wrapper{
        width:245px;
    }
`;


export const SComLinkBtn = (props = {}) => {
  const {
    navLink = false,
    children = undefined,
    to = undefined,
    color = undefined,
    // size = undefined, size 대신 height로 사이즈 조절
    variant = undefined,
    style = {},
    activeStyle = {},
    icon = undefined,
    activeClass = undefined,
    target = undefined,
    height = undefined,
    state = {}
  } = props;
  const commonprops = {
    to,
    // size,
    color,
    variant,
    style,
    target,
    height
  };
  const Component = navLink ? NavLink : Link;

  return (
    <Component {...commonprops}
      state={state}
      style={navLink ? ({ isActive }) => (isActive ? { ...style, ...activeStyle } : style) : style}
      className={`btn ${navLink && typeof props.className === 'function' ? ({ isActive }) => isActive && activeClass : ''}`}
    >
      {icon && <span className="icon">{icon}</span>}
      {children}
    </Component >
  )
};


