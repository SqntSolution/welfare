import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { SFEm, SFMedia } from 'styles/StyledFuntion';
import { SUImg } from 'styles/StyledUser';

const CardItem = (props) => {
    const { img, label, title, text, to } = props;

    if (to) {
        return (
            <ItemBox className='card-box'>
                <Link to={to}>
                    <SUImg imgPath={img} />
                    {/* <span className={img ? 'cardItem-img' : 'cardItem-img no-img'}>
                            <img src={img ? img : DEFALUT_IMG} alt='' />
                        </span> */}
                    <div className='cardItem-contents'>
                        {label && <span className='cardItem-label'>{label}</span>}
                        {title && <h4 className='cardItem-title' title={title}>{title}</h4>}
                        {text && <div className='cardItem-txt'>{text}</div>}
                    </div>
                </Link>
            </ItemBox>
        )
    }

    return (
        <ItemBox className='card-box'>
            <SUImg imgPath={img} />
            {/* <span className={img ? 'cardItem-img' : 'cardItem-img no-img'}>
                    <img src={img ? img : DEFALUT_IMG} alt='' />
                </span> */}
            <div className='cardItem-contents'>
                {label && <span className='cardItem-label'>{label}</span>}
                {title && <h4 className='cardItem-title' title={title}>{title}</h4>}
                {text && <div className='cardItem-txt'>{text}</div>}
            </div>
        </ItemBox >

    );
}

export default CardItem;


const ItemBox = styled.div`
    .cardItem-contents{
        margin-top: 1em;
    }
    .cardItem-label,.cardItem-txt{
        font-size: ${SFEm(14, 16)};
        font-weight: 400;
        line-height: ${20 / 14};
        color: var(--color-primary);
    }
    .cardItem-title{
        font-size: ${SFEm(18, 16)};
        font-weight: 600;
        line-height: ${28 / 18};
        color: var(--color-text-base);
        margin-top: ${SFEm(8, 18)};
        margin-bottom: ${SFEm(16, 18)};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cardItem-txt{
        color: var(--color-tertiary);
    }
    ${SFMedia('mo-m', css`
        .cardItem-img{
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 0.7463556851;
            
        }
    `)}
`;