import { css } from "styled-components"

export const SFEm = (font, parents = 16) => {
    return font / parents + 'em'
}

export const SFFlexCenter = css`
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
`;

const defaultFont = 16;
export const mediaWidth = {
    'pc-l': 1921,
    'pc-m': 1600,
    'pc-s': 1440,

    'tab-l': 1280,
    'tab-m': 1024,
    'tab-s': 920,

    'mo-l': 750,
    'mo-m': 540,
    'mo-s': 375,

}

export const getBreakpoints = () => [
    { query: `screen and  (min-width: ${mediaWidth['pc-l'] + 1}px)`, info: { device: 'pc', deviceSize: 'pc-l' } },
    { query: `screen and  (min-width: ${mediaWidth['pc-s'] + 1}px) and (max-width: ${mediaWidth['pc-m']}px)`, info: { device: 'pc', deviceSize: 'pc-m' } },
    { query: `screen and  (min-width: ${mediaWidth['tab-l'] + 1}px) and (max-width: ${mediaWidth['pc-s']}px)`, info: { device: 'pc', deviceSize: 'pc-s' } },
    { query: `screen and  (min-width: ${mediaWidth['tab-m'] + 1}px) and (max-width: ${mediaWidth['tab-l']}px)`, info: { device: 'tab', deviceSize: 'tab-l' } },
    { query: `screen and  (min-width: ${mediaWidth['tab-s'] + 1}px) and (max-width: ${mediaWidth['tab-m']}px)`, info: { device: 'tab', deviceSize: 'tab-m' } },
    { query: `screen and  (min-width: ${mediaWidth['mo-l'] + 1}px) and (max-width: ${mediaWidth['tab-s']}px)`, info: { device: 'tab', deviceSize: 'tab-s' } },
    { query: `screen and  (min-width: ${mediaWidth['mo-m'] + 1}px) and (max-width: ${mediaWidth['mo-l']}px)`, info: { device: 'mo', deviceSize: 'mo-l' } },
    { query: `screen and  (min-width: ${mediaWidth['mo-s'] + 1}px) and (max-width: ${mediaWidth['mo-m']}px)`, info: { device: 'mo', deviceSize: 'mo-m' } },
    { query: `screen and  (max-width: ${mediaWidth['mo-m']}px)`, info: { device: 'mo', deviceSize: 'mo-s' } },
];

export const isUnderMedia = (deviceSize, targetSizes = []) => {
    const order = [
        'mo-s', 'mo-m', 'mo-l',
        'tab-s', 'tab-m', 'tab-l',
        'pc-s', 'pc-m', 'pc-l'
    ];
    return order.indexOf(deviceSize) <= order.indexOf(targetSizes);
};

/******** *사용 방법 *********
 *  ${SFMedia('pc-m', css` 
        
    `)}
****************************/
export const SFMedia = (section = undefined, styles) => {
    if (mediaWidth[section] !== undefined) {
        return css`
            @media screen and (max-width: ${mediaWidth[section]}px), (max-width: ${mediaWidth[section] / defaultFont}rem) {
                ${styles}
            }
        `;
    } else if (mediaWidth[section] === 'pc-l') {
        return css`
        @media screen and (min-width: ${mediaWidth[section]}px), (min-width: ${mediaWidth[section] / defaultFont}rem) {
            ${styles}
        }
    `;
    } else {
        return css`
            @media screen and (max-width: ${section}px), (max-width: ${section / defaultFont}rem) {
                ${styles}
        }
    `;
    }
};