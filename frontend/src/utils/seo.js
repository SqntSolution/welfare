// SEO 메타 태그 동적 설정 유틸리티

export const updateMetaTags = ({
    title = 'Elorien',
    description = '엘로리언, 오랜 시간 꿈꾸던 공간을 완성하고 다음 세대까지 함께할 수 있는 브랜드',
    image = '/img/og-image.png',
    url = window.location.href,
    type = 'website'
}) => {
    // 페이지 제목 설정
    document.title = title;

    // 기본 메타 태그 설정
    setMetaTag('name', 'description', description);

    // Open Graph 메타 태그 설정
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);

    // Twitter Card 메타 태그 설정
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:url', url);

    // 카카오톡 메타 태그 설정
    setMetaTag('property', 'kakao:title', title);
    setMetaTag('property', 'kakao:description', description);
    setMetaTag('property', 'kakao:image', image);
};


// 메타 태그 설정 헬퍼 함수
const setMetaTag = (attribute, name, content) => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (element) {
        element.setAttribute('content', content);
    } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
    }
};

// 페이지별 SEO 설정 프리셋
export const seoPresets = {
    main: {
        title: 'Elorien',
        description: '엘로리언, 오랜시간 꿈꾸던 공간을 완성하고 다음 세대까지 함께할 수 있는 브랜드',
        image: '/img/og-image.png'
    },
};

// 게시물 상세 페이지용 SEO 설정
export const updatePostSEO = (post) => {
    if (!post) return;
    const title = post.title ? `Elorien - ${post.title}` : 'Elorien';
    const description = post.description ||
        (post.content?.replace(/<[^>]*>/g, '').substring(0, 160)) ||
        '엘로리언의 최신 소식입니다.';
    const image = post.representativeImagePath
        ? `${window.location.origin}/api/v1/view/image/${post.representativeImagePath}`
        : `${window.location.origin}/img/og-image.png`;
    const url = window.location.href;

    // 즉시 메타 태그 업데이트
    requestAnimationFrame(() => {
        updateMetaTags({
            title,
            description,
            image,
            url,
            type: 'article'
        });

        // 개발 환경에서 디버깅 정보 출력
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 SEO 메타 태그 업데이트됨:', {
                title,
                description,
                image,
                url
            });
        }
    });

    // 추가적으로 약간의 지연 후 다시 한 번 업데이트 (크롤러 대응)
    setTimeout(() => {
        updateMetaTags({
            title,
            description,
            image,
            url,
            type: 'article'
        });
    }, 100);
};

// 개발 환경에서 SEO 메타 태그 디버깅
export const debugSEO = () => {
    if (process.env.NODE_ENV === 'development') {
        const metaTags = {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content,
            ogTitle: document.querySelector('meta[property="og:title"]')?.content,
            ogDescription: document.querySelector('meta[property="og:description"]')?.content,
            ogImage: document.querySelector('meta[property="og:image"]')?.content,
            ogUrl: document.querySelector('meta[property="og:url"]')?.content,
            twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
            twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content,
            twitterImage: document.querySelector('meta[name="twitter:image"]')?.content,
            kakaoTitle: document.querySelector('meta[property="kakao:title"]')?.content,
            kakaoDescription: document.querySelector('meta[property="kakao:description"]')?.content,
            kakaoImage: document.querySelector('meta[property="kakao:image"]')?.content,
        };

        console.group('🔍 SEO Meta Tags Debug');
        console.table(metaTags);
        console.groupEnd();

        return metaTags;
    }
}; 