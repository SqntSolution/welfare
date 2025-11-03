// 경로(예:/my/scrap)로부터 label(예:Scrap)을 리턴.
export const getLabelByPath = (menu, path) => {
    return menu?.find(e => path.includes(e.link))?.label
}

// 경로(예:/my/scrap)로부터 key(예:scrap)을 리턴.
export const getKeyByPath = (menu, path) => {
    return menu?.find(e => path.includes(e.link))?.key
}

// key(예:/my/scrap)로부터 link(예:/my/scrap)을 리턴.
export const getLinkByKey = (menu, key) => {
    return menu?.find(e => e.key === key)?.link
}