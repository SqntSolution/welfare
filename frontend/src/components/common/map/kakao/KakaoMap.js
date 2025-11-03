/**
 * @file kakaoMap.js
 * @description 카카오맵 API
 * @author 이병은
 * @since 2025-05-26 10:11
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2025-05-26 10:11    이병은       최초 생성
 **/

import { Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { FiMinus, FiPlus, FiRotateCcw } from 'react-icons/fi';
import styled from 'styled-components';
import { SFEm } from 'styles/StyledFuntion';


/**
 * 카카오맵 옵션
 * @type {{
 *  option: {
 *      center: {lat: number, lng: number},  // 지도 중심 좌표
 *      level: number,              // 지도 확대 레벨 (숫자가 클수록 축소됨)
 *      draggable?: boolean,        // 드래그 가능 여부
 *      scrollwheel?: boolean,      // 휠로 확대/축소 가능 여부
 *      disableDoubleClick?: boolean // 더블클릭 확대 비활성화 여부
 *  },
 *  marker: {visible: boolean, text: string },  // 마커 표시
 *  address: string // 표시할 주소
 * }}
 * 
 */
const KakaoMap = (props) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const geocoder = useRef(null);
    const markerRef = useRef(null);
    const infowindowRef = useRef(null);
    const [coords, setCoords] = useState(null); // 좌표 상태로 관리
    const { kakao } = window;
    const DEFAULT_ADDRESS = '선유로70';

    // 주소 → 좌표 변환 (최초/주소 변경 시 1회만)
    useEffect(() => {
        geocoder.current = new kakao.maps.services.Geocoder();
        const addressToSearch = props?.address && props?.address.trim() ? props?.address : DEFAULT_ADDRESS;
        geocoder.current.addressSearch(addressToSearch, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setCoords(new kakao.maps.LatLng(result[0].y, result[0].x));
            } else if (addressToSearch !== DEFAULT_ADDRESS) {
                // 실패 시 fallback
                geocoder.current.addressSearch(DEFAULT_ADDRESS, (result2, status2) => {
                    if (status2 === kakao.maps.services.Status.OK) {
                        setCoords(new kakao.maps.LatLng(result2[0].y, result2[0].x));
                    }
                });
            }
        });
    }, [props?.address]);

    // coords가 바뀔 때마다 지도/마커 셋팅 (API 조회 없이)
    useEffect(() => {
        if (!coords) return;
        let map;
        if (!mapRef.current) {
            map = new kakao.maps.Map(mapContainer.current, {
                center: coords,
                level: props.option?.level ?? 3,
                ...props.option,
            });
            mapRef.current = map;
        } else {
            map = mapRef.current;
            map.setCenter(coords);
            map.setLevel(props.option?.level ?? 3); // level도 항상 초기화
        }
        setMarker(coords);
    }, [coords, props.option?.level]);

    // 마커 셋팅 함수 (API 조회 없이)
    const setMarker = (position) => {
        if (!mapRef.current || !props?.marker?.visible) return;
        if (markerRef.current) markerRef.current.setMap(null);
        if (infowindowRef.current) infowindowRef.current.close();

        const marker = new kakao.maps.Marker({
            position,
            map: mapRef.current,
        });
        markerRef.current = marker;

        if (props?.marker?.text) {
            const infowindow = new kakao.maps.InfoWindow({
                content: `<div class='marker-text'>${props?.marker?.text}</div>`,
            });
            infowindow.open(mapRef.current, marker);
            infowindowRef.current = infowindow;
        }
    };

    // reset: 기존 좌표와 level로만 초기화
    const reset = () => {
        if (!coords || !mapRef.current) return;
        mapRef.current.setCenter(coords);
        mapRef.current.setLevel(props.option?.level ?? 3);
        setMarker(coords);
    };

    const zoomIn = () => {
        if (!mapRef.current) return;
        const level = mapRef.current.getLevel() - 1;
        mapRef.current.setLevel(level);
    }

    const zoomOut = () => {
        if (!mapRef.current) return;
        const level = mapRef.current.getLevel() + 1;
        mapRef.current.setLevel(level);
    }

    return (
        <>
            <KaKaoWrap
                id='kakao-map'
                className='map-wrap'
                ref={mapContainer}
                style={{
                    width: SFEm(804, 16),
                    height: SFEm(444, 16),
                }}
            >
                <div className="custom_zoomcontrol">
                    <Button className='zoom_btn' onClick={zoomIn} icon={<FiPlus />}></Button>
                    <Button className='zoom_btn' onClick={zoomOut} icon={<FiMinus />}></Button>
                    <Button className='reset_btn' onClick={reset} icon={<FiRotateCcw />}></Button>
                </div>
            </KaKaoWrap>
        </>
    )
}
export default KakaoMap

const KaKaoWrap = styled.div`
    .marker-text{
        font-size: ${SFEm(14, 16)};
        text-align: center;
        display: block;
        padding: 0 4px;
        margin: 0 auto;
    }

    .custom_zoomcontrol {
        position:absolute;
        top:150px;
        right:10px;
        width:36px;
        height:fit-content;
        overflow:hidden;
        z-index:2;
    }
`