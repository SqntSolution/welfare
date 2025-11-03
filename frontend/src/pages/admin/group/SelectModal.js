import { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
/**
 * @Props
 * isModalOpen: modal Open State Boolean
 * setIsModalOpen: modal Open State 제어 Function
 * title: modal title
 * selectMode: multiple / null
 * selectOptions: Select에 들어갈 목록 List
 * optionRender: 데이터 render 형식 Function - (data) => (<>{data.field명}<>)
 * labelRender: label render 형식 Function(String으로 return 필요) - (data) => {data.field명}
 * onOkHandler: modal onOk 이벤트 리스터 Function
 */
export const SelectModal = (props) => {
    const { isModalOpen, setIsModalOpen, title, selectMode, selectOptions, optionRender, labelRender, onOkHandler, closeOnSelect } = props;
    
    const [selected, setSelected] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        // 확인용!
        // if(isModalOpen)
        //     console.log('props @@==', props);

        if(labelRender)
            setOptions(selectOptions.map(d => ({...d, renderedLabel : labelRender(d)})));
        else
            setOptions(selectOptions);

    }, [isModalOpen])

    const onOkClickHandler = (e) => {
        e.preventDefault();
        onOkHandler(selectOptions.filter(d => selected.includes(d.value)));
        setIsModalOpen(false);
    };

    const onSelectChangeHandler = (e) => {
        setSelected(e);
    };

    return (
        <Modal
            afterClose={() => setSelected([])}
            title={title}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={onOkClickHandler}
            maskClosable={false}>
            <Select
                value={selected}
                mode={selectMode}
                options={options}
                style={{ width: '100%' }}
                onChange={onSelectChangeHandler}
                showSearch
                allowClear
                filterOption={(input, option) => (option?.label ?? '').includes(input) || (option?.renderedLabel ?? '').includes(input)}
                optionLabelProp={labelRender ? 'renderedLabel' : 'label'}
                optionFilterProp='children'
                optionRender={optionRender}
            />
            <div style={{ height: 150 }} />
        </Modal>
    );
};
