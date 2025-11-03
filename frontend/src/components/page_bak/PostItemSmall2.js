// POST 한개 - 이미지가 작게 보이고, 2줄짜리
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from 'styled-components';
import { isEmptyCheck } from 'utils/helpers';
import { SUText14, SUText20 } from 'styles/StyledUser';
import Ribbon from 'antd/es/badge/Ribbon';
import { mediaWidth, SFEm, SFMedia } from 'styles/StyledFuntion';

export const PostItemSmall2 = ({ id, representativeImagePath, title, description, strategicMarketingOnly, menuName2 }) => {

    const navigate = useNavigate();
    let imgPath = null
    if (representativeImagePath != null && representativeImagePath != '') {
        imgPath = `url(/api/v1/view/image/${representativeImagePath?.split("/")?.filter(e => e != "")?.join("/")})`
    } else {
        imgPath = ``
    }

    return (
        <PostSmallStyled>
            <Link to={`/post/${id}`} className='post-inner'>
                <div
                    className="img-box"
                    style={{

                        aspectRatio: '4/3',
                        backgroundImage: `${isEmptyCheck(imgPath) ? 'url(/img/emptystate.png)' : imgPath}`,
                        backgroundSize: `${isEmptyCheck(imgPath) ? 'contain' : 'cover'}`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        borderRight: '1px solid #F0F0F0',
                    }}
                >
                    <Ribbon
                        text={menuName2}
                        color={strategicMarketingOnly ? "#EA1D22" : "#000"}
                        placement='start'
                    />
                </div>

                <div className='post-con'>
                    <SUText20 className='title' $weight={'500'}>{title}</SUText20>
                    <SUText14 className='description'>{description}</SUText14>
                </div>
            </Link>
        </PostSmallStyled>
    )
}

const PostSmallStyled = styled.div`
    font-size: 16px;
    & + &{
        margin-top: ${SFEm(12)};
    }
    .post-inner{
        display: flex;
        border: 1px solid #F0F0F0;
        .img-box{
            min-width: ${SFEm(250)};
            width: ${SFEm(250)};
        }
    }
    .post-con{
        padding: 2em;
        .title{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .description{
            margin-top: ${SFEm(8, 14)};
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
${SFMedia('tab-l', css`
    font-size: 14px;
`)};
${SFMedia('mo-l', css`
    font-size:  clamp(12px,${12 / mediaWidth['mo-m'] * 100}vw, 14px) ;
    .post-inner{
        .img-box{
            min-width: ${SFEm(200)};
            width: ${SFEm(200)};
        }
    }
`)};
${SFMedia('mo-s', css`
    .post-inner{
        flex-wrap: wrap;
        .img-box{
            min-width: 0;
            width: 100%;
            border-right: 0 !important;
            border-bottom: 1px solid #F0F0F0;
        }
    }
`)};
`;