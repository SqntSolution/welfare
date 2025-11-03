export const validatePassword = (value, userInfo = {}) => {
    if (!value) return Promise.resolve();

    const hasMinLength = value.length >= 8;
    const hasLetter = /[A-Za-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]}{;':",.<>/?]/.test(value);
    const hasHangul = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value); // 한글 포함 여부

    if (hasHangul) {
        return Promise.reject('비밀번호에는 한글을 포함할 수 없습니다.');
    }

    if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecialChar) {
        return Promise.reject(
            '비밀번호는 최소 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.'
        );
    }

    const forbiddenPatterns = [
        /(.)\1{2,}/,                  // 동일 문자 반복 (예: aaa)
        /1234|abcd|qwer|asdf|zxcv/,   // 키보드 순서
        /^\d+$/,                      // 숫자만
        /password|security/i,         // 흔한 단어
    ];

    for (let pattern of forbiddenPatterns) {
        if (pattern.test(value)) {
            return Promise.reject('보안에 취약한 패턴이 포함되어 있습니다.');
        }
    }

    // 사용자 ID 또는 이름 포함 여부 확인
    const { userId, name } = userInfo;
    const lowerValue = value.toLowerCase();

    if (
        (userId && lowerValue.includes(userId.toLowerCase())) ||
        (name && lowerValue.includes(name.toLowerCase()))
    ) {
        return Promise.reject('비밀번호에 사용자 ID나 이름을 포함할 수 없습니다.');
    }

    return Promise.resolve();
};
