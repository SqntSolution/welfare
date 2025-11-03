import { useEffect, useState } from 'react';
import { Modal, Flex, Button, Table, Input } from 'antd';
import styled from 'styled-components';
/**
 * @Props
 * isModalOpen: modal Open State Boolean
 * setIsModalOpen: modal Open State 제어 Function
 * title: modal title
 * data: data list
 * columns: 테이블 컬럼
 * rowKey: 테이블 rowKey
 * placeholder: 검색 input placeholder
 */

const { Search } = Input;

export const SelectTableModal = (props) => {
    const { isModalOpen, setIsModalOpen, title, data, columns, rowKey, placeholder, loading, width } = props;

    const [searchText, setSearchText] = useState('');
    const [current, setCurrent] = useState(1);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // 확인용!
        // if(isModalOpen)
        //     console.log('props @@==', props);

        setSearchText('');
        setFilteredData(data);
        setCurrent(1);
    }, [isModalOpen, data])

    useEffect(() => {
        setFilteredData(data.filter(d => {


            let flag = false;

            columns.forEach(c => {

                const value = d[c.key];
                if (typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase()))
                    flag = true;

                // console.log('d[c.key]', d[c.key]);
                // if (d[c.key]?.toLowerCase().includes(searchText.toLowerCase()))
                //     flag = true;
            })

            return flag;
        }));

        setCurrent(1);
    }, [searchText])

    return (
        <StyledModal
            destroyOnClose
            width={width ?? 600}
            title={title}
            open={isModalOpen}
            maskClosable={false}
            onCancel={() => setIsModalOpen(false)}
            footer={<Flex justify='center'><Button type='primary' style={{ width: 104 }} onClick={() => setIsModalOpen(false)}>닫기</Button></Flex>}>

            <div className='modal-body'>
                <Search
                    placeholder={placeholder}
                    allowClear
                    enterButton='검색'
                    onSearch={(e) => setSearchText(e)}
                    style={{ marginBottom: '18px' }} />
                <Table
                    size='small'
                    dataSource={filteredData}
                    columns={columns}
                    rowKey={rowKey}
                    loading={loading ?? false}
                    pagination={{ position: ['bottomCenter'], current: current, onChange: (page) => setCurrent(page) }}
                />
            </div>
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    &.ant-modal .ant-modal-content{padding:0; padding-bottom: 24px; }
    .ant-modal-header{
        padding: 16px 24px; 
        text-align: center;
        line-height: 24px; 
        font-size: 16px; 
        font-weight: 500;
        box-shadow: 0px -1px 0px 0px rgba(240, 240, 240, 1) inset;
        margin:0;
    }
    .modal-body{padding:24px 24px 0 24px;}
`