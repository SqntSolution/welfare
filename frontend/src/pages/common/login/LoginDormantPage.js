import React from "react";
import { Typography, Radio, Button, Card } from "antd";
import { Link, Route, useParams, useLocation, BrowserRouter as Router, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { AXIOS } from 'utils/axios';

const { Title, Text } = Typography;

const LoginDormantPage = () => {
    const navigate = useNavigate();



    /**
     * 토큰으로 id 조회
     * @returns 
     */
    const dormantRestore = async () => {
        return await AXIOS.post(`/api/v1/common/login/reactivate`)
            .then((res) => {
                const data = res?.data
                console.log('data', data)
                navigate("/")
            })
            .catch((err) => {
                console.log('err', err)
            });
    }


    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
            <Card style={{ width: 400, textAlign: "center", borderRadius: 10 }}>
                <Title level={2} style={{ color: "#03C75A", marginBottom: 10 }}>츤</Title>
                <Title level={4}>휴면상태</Title>
                <Text type="secondary">
                    최근 1년 동안 로그인하지 않아 휴면 상태입니다. <br />
                    아래 수단을 통해 인증하신 후 홈페이지를 이용해 주세요.
                </Text>

                <div style={{ marginTop: 30, textAlign: "left" }}>
                    <Radio checked>
                        <Text strong>휴대전화 본인인증</Text>
                        <div style={{ fontSize: 12, color: "#888" }}>
                            (현재 사용하고 있는 전화번호)
                        </div>
                    </Radio>
                </div>

                <Button type="primary" size="large" block style={{ marginTop: 30 }} onClick={dormantRestore}>
                    확인
                </Button>
            </Card>
        </div>
    );
};

export default LoginDormantPage;
