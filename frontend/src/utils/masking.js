/**
 * 개인정보 마스킹 유틸리티 함수들
 */

/**
 * 전화번호 마스킹
 * @param {string} phone - 전화번호 (01012345678 또는 010-1234-5678 형식)
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 전화번호
 */
export const maskPhoneNumber = (phone, maskChar = '*') => {
    if (!phone) return '';
    
    // 하이픈 제거
    const cleanPhone = phone.replace(/-/g, '');
    
    // 11자리 휴대폰 번호인 경우
    if (cleanPhone.length === 11) {
        return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, `$1-${maskChar.repeat(4)}-$3`);
    }
    
    // 10자리 전화번호인 경우
    if (cleanPhone.length === 10) {
        return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, `$1-${maskChar.repeat(3)}-$3`);
    }
    
    // 기타 형식은 중간 부분만 마스킹
    if (cleanPhone.length > 4) {
        const start = cleanPhone.substring(0, 2);
        const end = cleanPhone.substring(cleanPhone.length - 2);
        const middle = maskChar.repeat(cleanPhone.length - 4);
        return `${start}${middle}${end}`;
    }
    
    return phone;
};

/**
 * 이메일 주소 마스킹
 * @param {string} email - 이메일 주소
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 이메일 주소
 */
export const maskEmail = (email, maskChar = '*') => {
    if (!email) return '';
    
    const [localPart, domain] = email.split('@');
    
    if (!domain) return email;
    
    // 로컬 파트 마스킹 (첫 글자와 마지막 글자만 보이게)
    let maskedLocal = localPart;
    if (localPart.length > 2) {
        const first = localPart[0];
        const last = localPart[localPart.length - 1];
        const middle = maskChar.repeat(localPart.length - 2);
        maskedLocal = `${first}${middle}${last}`;
    }
    
    return `${maskedLocal}@${domain}`;
};

/**
 * 이름 마스킹
 * @param {string} name - 이름
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 이름
 */
export const maskName = (name, maskChar = '*') => {
    if (!name) return '';
    
    if (name.length === 1) return name;
    
    if (name.length === 2) return `${name[0]}${maskChar}`;
    
    // 3글자 이상인 경우 가운데 글자들 마스킹
    const first = name[0];
    const last = name[name.length - 1];
    const middle = maskChar.repeat(name.length - 2);
    
    return `${first}${middle}${last}`;
};

/**
 * 주민등록번호 마스킹
 * @param {string} rrn - 주민등록번호 (하이픈 포함 또는 미포함)
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 주민등록번호
 */
export const maskResidentNumber = (rrn, maskChar = '*') => {
    if (!rrn) return '';
    
    // 하이픈 제거
    const cleanRrn = rrn.replace(/-/g, '');
    
    if (cleanRrn.length === 13) {
        return cleanRrn.replace(/(\d{6})(\d{7})/, `$1-${maskChar.repeat(7)}`);
    }
    
    return rrn;
};

/**
 * 계좌번호 마스킹
 * @param {string} accountNumber - 계좌번호
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 계좌번호
 */
export const maskAccountNumber = (accountNumber, maskChar = '*') => {
    if (!accountNumber) return '';
    
    const cleanAccount = accountNumber.replace(/[^0-9]/g, '');
    
    if (cleanAccount.length > 4) {
        const start = cleanAccount.substring(0, 4);
        const end = cleanAccount.substring(cleanAccount.length - 4);
        const middle = maskChar.repeat(cleanAccount.length - 8);
        return `${start}${middle}${end}`;
    }
    
    return accountNumber;
};

/**
 * 카드번호 마스킹
 * @param {string} cardNumber - 카드번호
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 카드번호
 */
export const maskCardNumber = (cardNumber, maskChar = '*') => {
    if (!cardNumber) return '';
    
    const cleanCard = cardNumber.replace(/[^0-9]/g, '');
    
    if (cleanCard.length === 16) {
        return cleanCard.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, `$1-${maskChar.repeat(4)}-${maskChar.repeat(4)}-$4`);
    }
    
    return cardNumber;
};

/**
 * 주소 마스킹 (상세주소만)
 * @param {string} address - 전체 주소
 * @param {string} maskChar - 마스킹 문자 (기본값: '*')
 * @returns {string} 마스킹된 주소
 */
export const maskAddress = (address, maskChar = '*') => {
    if (!address) return '';
    
    // 도로명 주소에서 건물번호 이후 부분 마스킹
    const buildingIndex = address.search(/[0-9]+(-[0-9]+)?$/);
    
    if (buildingIndex !== -1) {
        const baseAddress = address.substring(0, buildingIndex);
        const buildingNumber = address.substring(buildingIndex);
        
        // 건물번호의 일부만 마스킹
        if (buildingNumber.length > 2) {
            const maskedBuilding = buildingNumber[0] + maskChar.repeat(buildingNumber.length - 2) + buildingNumber[buildingNumber.length - 1];
            return baseAddress + maskedBuilding;
        }
    }
    
    return address;
};

/**
 * 조건부 마스킹 (권한에 따라)
 * @param {string} value - 마스킹할 값
 * @param {string} type - 마스킹 타입 ('phone', 'email', 'name', 'rrn', 'account', 'card', 'address')
 * @param {boolean} hasPermission - 마스킹 해제 권한 여부
 * @param {string} maskChar - 마스킹 문자
 * @returns {string} 마스킹된 값 또는 원본 값
 */
export const conditionalMask = (value, type, hasPermission = false, maskChar = '*') => {
    if (hasPermission) return value;
    
    switch (type) {
        case 'phone':
            return maskPhoneNumber(value, maskChar);
        case 'email':
            return maskEmail(value, maskChar);
        case 'name':
            return maskName(value, maskChar);
        case 'rrn':
            return maskResidentNumber(value, maskChar);
        case 'account':
            return maskAccountNumber(value, maskChar);
        case 'card':
            return maskCardNumber(value, maskChar);
        case 'address':
            return maskAddress(value, maskChar);
        default:
            return value;
    }
};

/**
 * 테이블 컬럼용 마스킹 렌더러
 * @param {string} value - 마스킹할 값
 * @param {string} type - 마스킹 타입
 * @param {boolean} hasPermission - 권한 여부
 * @param {string} maskChar - 마스킹 문자
 * @returns {JSX.Element} 마스킹된 텍스트 또는 원본 텍스트
 */
export const MaskedText = ({ value, type, hasPermission = false, maskChar = '*', ...props }) => {
    const maskedValue = conditionalMask(value, type, hasPermission, maskChar);
    
    return (
        <span {...props}>
            {maskedValue}
        </span>
    );
}; 