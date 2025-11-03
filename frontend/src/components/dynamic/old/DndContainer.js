// [안씀] DnD되는 container => DynamicTestPage.js에 합쳤음.
import { MenuOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';
import { Table, Button, Select } from 'antd';


const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
        position: 'relative',
        zIndex: 9999,  //=> 이게 있으면, 젤 처음에 바깥에 있는 selectbox를 펼쳤을때 밑으로 들어가서 안보에게 되더라.
      }
      : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (<>
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move',
                }}
                {...listeners}
              />
            </>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};


export const DndContainer = (props) => {
  const [dataSource, setDataSource] = useState(props?.dataSource ?? []);
  const [comp, setComp] = useState(null)
  const addComp = props?.addComp
  const removeComp = props?.removeComp
  const setComponents = props?.setComponents

  const handleChange = (value) => {
    console.log(`== selected ${value}`);
    setComp(value)
  };
  useEffect(() => {
    setComp("F")
  }, [])

  const columns = [
    {
      key: 'sort',
      width: 40,
      title: 'move',
    },
    {
      key: 'remove',
      width: 60,
      title: "삭제",
      render: (text, record, idx) => <Button shape="circle" danger size="small" icon={<CloseOutlined />} onClick={() => removeComp(record.key)} />,
    },
    {
      title: 'Contents',
      render: (text, record, idx) => <>{record?.comp}</>,
      // render: (text, record, idx) => <>{text} , {JSON.stringify(record ?? {})} ({idx})</>,
    },
  ];


  useEffect(() => {
    if (props?.dataSource != null) {
      console.log("=== useEffect, datasource")
      setDataSource(props?.dataSource)
    }
  }, [props?.dataSource])
  // console.log("=== rendering")

  const onDragEnd = ({ active, over }) => {
    console.log("=== onDragEnd : ", active, over)
    if (active.id !== over?.id) {
      setComponents((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Select
          defaultValue="editor"
          style={{
            width: 220,
          }}
          value={comp}
          onChange={handleChange}
          options={[
            {
              value: 'C',
              label: 'editor',
            },
            {
              value: 'F',
              label: 'file download',
            },
            {
              value: 'P',
              label: 'pdf viewer',
            },
          ]}

        />
        <Button onClick={()=>addComp(comp)}>추가</Button>

        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};