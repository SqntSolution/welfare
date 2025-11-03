/**
 * @format
 */
import { useEffect, useState } from 'react';
import { Modal, Select, Space } from 'antd';
/**
 *
 * @param {*} modalProps
 * setFunc: setState함수,
 * titleNm: 모달 제목,
 * selectedData: 선택된 대상,
 * target: member or team,
 * mode: mutiple or null,
 * @returns
 */
export const AdminAlarmModal = ({ isModalOpen, setIsModalOpen, modalProps }) => {
    // const { data, title, isModalOpen, setIsModalOpen, func, selectedData } = props;
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSelected(modalProps?.selectedData.map((elem) => elem.value));
    }, [isModalOpen]);

    const optionsMember = [
        {
            value: 'hong1',
            label: '홍길동',
            teamNm: '전략마케팅 2팀',
            empGradeNm: '과장',
        },
        {
            value: 'hong2',
            label: '임꺽정',
            teamNm: '전략마케팅 4팀',
            empGradeNm: '부장',
        },
        {
            value: 'hong3',
            label: '조조',
            teamNm: '영업 1팀',
            empGradeNm: '사원',
        },
        {
            value: 'hong4',
            label: '유비',
            teamNm: '디자인 1팀',
            empGradeNm: '사원',
        },
    ];

    const optionsTeam = [
        {
            value: 'D0199',
            label: '전략마케팅',
            teamNm: 'BM1(전마)',
        },
        {
            value: 'D0091',
            label: '해외영업',
            teamNm: '1팀',
        },
        {
            value: 'D0148',
            label: 'COSMAX 연구소',
            teamNm: 'BT Lab 1팀',
        },
        {
            value: 'D0111',
            label: 'COSMAX 연구소',
            teamNm: 'BI Lab 1팀',
        },
        {
            value: 'D0135',
            label: 'COSMAX 연구소',
            teamNm: 'BI Lab 2팀',
        },
    ];

    const onOkClickHandler = (e) => {
        e.preventDefault();
        const arr = modalProps?.target === 'member' ? optionsMember : optionsTeam;
        modalProps.setFunc(arr.filter((elem) => selected.includes(elem.value)));
        setIsModalOpen(false);
    };

    const onSelectChangeHandler = (e) => {
        // console.log('셀렉트 변경 이벤트 : ', e);
        setSelected(e);
    };

    return (
        <Modal
            afterClose={() => setSelected([])}
            title={modalProps?.titleNm ?? '모달'}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={onOkClickHandler}
            maskClosable={false}>
            <Select
                showSearch
                mode={modalProps?.mode}
                style={{ width: '100%' }}
                placeholder={`${modalProps?.target}를 선택하거나 검색하세요.`}
                // onChange={onSearchTextChanged}
                // tokenSeparators={[',']}
                options={modalProps?.target === 'member' ? optionsMember : optionsTeam}
                optionFilterProp='children'
                filterOption={(input, option) => (option?.label ?? '').includes(input) || (option?.teamNm ?? '').includes(input)}
                optionLabelProp='label'
                // value={searchCondition?.textCondition?.split(",")?.filter(elem => elem !== '')}
                allowClear
                optionRender={(option) => {
                    return modalProps?.target === 'member' ? (
                        <Space>
                            [{option.data.teamNm}]{option.data.label}
                            {option.data.empGradeNm}
                        </Space>
                    ) : (
                        <Space>
                            [{option.data.label}] [{option.data.teamNm}]
                        </Space>
                    );
                }}
                value={selected}
                onChange={onSelectChangeHandler}
            />
            <div style={{ height: 150 }} />
        </Modal>
    );
};
