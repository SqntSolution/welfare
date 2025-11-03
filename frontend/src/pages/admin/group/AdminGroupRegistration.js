import { Breadcrumb, Button, Col, Descriptions, Flex, Input, Popconfirm, Row, Space, Table, Typography } from "antd";
import { useMsg } from "hooks/helperHook";
import { useConfirmPopup } from 'hooks/popups';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AXIOS } from 'utils/axios';
import AuthCheckBoxTable from "./AuthCheckboxTable";
import { CustomAdminTitle } from "components/common/CustomComps";
import { InnerAdminDiv } from "styles/StyledCommon";


export const AdminGroupRegistration = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [tableData, setTableData] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [menuInfoList, setMenuInfoList] = useState([]);
    const [deleteAuth, setDeleteAuth] = useState(true);

    const { id } = useParams();
    const navigate = useNavigate();

    const [confirm, confirmContextHolder] = useConfirmPopup();
    const { error, info } = useMsg()

    useEffect(() => {
        getMenuData();
    }, []);

    useEffect(() => {
        if (tableData.length > 0)
            getGroupDetail();
    }, [tableData]);

    const getMenuData = async () => {
        return await AXIOS.get("/api/v1/admin/group/menu")
            .then(async (resp) => {
                setTableData(resp?.data);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const getGroupDetail = async () => {
        if (id === undefined)
            return;

        return await AXIOS.get(`/api/v1/admin/group/${id}`)
            .then(async (resp) => {
                setGroupName(resp?.data.groupNm);
                setGroupDesc(resp?.data.description);
                setMenuInfoList(resp?.data.menuInfoList);
                setDeleteAuth(!resp?.data.immutable ?? true)
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const registerGroup = async () => {
        if (id !== undefined)
            return;

        const params = await makeParam();

        return await AXIOS.post(`/api/v1/admin/group`, params)
            .then(async (resp) => {
                info('저장되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const updateGroup = async () => {
        if (id === undefined)
            return;

        const params = await makeParam();

        return await AXIOS.post(`/api/v1/admin/group/${id}`, params)
            .then(async (resp) => {
                info('저장되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const deleteGroup = async () => {
        if (id === undefined)
            return;

        return await AXIOS.delete(`/api/v1/admin/group/${id}`)
            .then(async (resp) => {
                info('삭제되었습니다.')
                navigate(-1);
                return resp;
            })
            .catch((err) => {
                error(err);
            })
            .finally(() => { });
    };

    const validateInput = async () => {
        if (groupName === '')
            return '그룹 명 정보를 입력해주세요.';

        if (groupDesc === '')
            return '그룹 설명 정보를 입력해주세요.';

        if (checkedList.length === 0)
            return '그룹 접근 카테고리 정보를 입력해주세요.';

        return '';
    }

    const makeParam = async () => {
        const authMenuList = [];

        checkedList.filter(d => d.split('-').length === 2).forEach((d) => {
            const splitData = d.split('-');

            authMenuList.push({
                menuId: Number(splitData[1]),
                fileDownloadYn: '',
            });
        });

        checkedList.filter(d => d.split('-').length === 4).forEach((d) => {
            const splitData = d.split('-');

            authMenuList.push({
                menuId: Number(splitData[1]),
                fileDownloadYn: '',
            });

            if (splitData[3] === 'File') {
                authMenuList.push({
                    menuId: Number(splitData[2]),
                    fileDownloadYn: 'Y',
                });
            }
            else if (!checkedList.includes(`${d.substring(0, 7)}-File`)) {
                authMenuList.push({
                    menuId: Number(splitData[2]),
                    fileDownloadYn: '',
                });
            }
        });

        return ({
            groupNm: groupName,
            description: groupDesc,
            authMenuList: authMenuList.filter((item1, i, arr) => arr.findIndex(item2 => item1.menuId === item2.menuId) === i)
        });
    };

    const submit = async () => {
        const validateMessage = await validateInput();

        if (validateMessage !== '') {
            error(validateMessage);
        }
        else {
            if (id === undefined)
                registerGroup();
            else
                updateGroup();
        }
    }

    const resetFields = () => {
        setGroupName('');
        setGroupDesc('');
        setCheckedList([]);
    }
    const breadcrumb = [
        { title: "Home" },
        { title: "그룹" },
        { title: "그룹 정보 관리" },
        { title: id === undefined ? "등록" : "수정" },
    ]
    return (
        <>
            {confirmContextHolder}
            <CustomAdminTitle title={`권한 그룹 ${id === undefined ? "등록" : "수정"}`} items={breadcrumb} />
            <InnerAdminDiv>
                {/* 입력 폼 */}
                <Descriptions
                    labelStyle={{ color: 'rgba(0, 0, 0, 0.85)', width: 90, textAlign: 'right', justifyContent: 'end' }} size="small"
                    style={{ marginBottom: 24 }}
                >
                    <Descriptions.Item label={"그룹 명"} span={3}>
                        <Input showCount
                            onChange={e => {
                                if (e.target.value.length <= 30)
                                    setGroupName(e.target.value)
                            }}
                            value={groupName}
                            maxLength={30}
                            // bordered={false} 
                            placeholder="그룹 명를 입력해주세요. (30자 이내)"
                            style={{ width: 500 }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label={"그룹 설명"} span={3}>
                        <Input.TextArea showCount
                            onChange={e => {
                                if (e.target.value.length <= 100)
                                    setGroupDesc(e.target.value)
                            }}
                            value={groupDesc}
                            style={{ resize: 'none', width: 500 }}
                            rows={3}
                            maxLength={100}
                            // bordered={false} 
                            placeholder="그룹 설명을 입력해주세요. (100자 이내)"
                        />
                    </Descriptions.Item>
                </Descriptions>

                {/* 카테고리 테이블 */}
                <AuthCheckBoxTable
                    rowKey='id'
                    dataSource={tableData}
                    checkedList={checkedList}
                    setCheckedList={setCheckedList}
                    menuInfoList={menuInfoList}
                    fileDownloadYn={true} />

                {/* 목록, 취소, 삭제, 등록 버튼 */}
                <Flex justify={'center'} gap={8} style={{ marginTop: 32 }}>
                    <Button onClick={() => navigate(-1)} size="large" style={{ width: 114 }}>목록</Button>
                    {id === undefined && <Button onClick={() => resetFields()} size="large" style={{ width: 114 }}>초기화</Button>}
                    {(id && deleteAuth) &&
                        <Popconfirm
                            title={<div>{groupName} <br /> 그룹을 삭제합니다. <br /> 삭제된 그룹에 소속된 팀은 권한 그룹’이 초기화 됩니다.</div>}
                            description=''
                            okText='확인'
                            cancelText='취소'
                            onConfirm={() => deleteGroup()}>
                            <Button type='primary' danger
                                size="large"
                                style={{ width: 114 }}>
                                삭제
                            </Button>
                        </Popconfirm>}
                    <Button type='primary' onClick={() => submit()} size="large" style={{ width: 114 }}>등록</Button>
                </Flex>
            </InnerAdminDiv>
        </>
    );
};

export default AdminGroupRegistration;