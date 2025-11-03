import React, { useEffect } from 'react';
import { Layout, Affix } from 'antd';
import { HeaderMyInfo } from './HeaderMyInfo';

export const Header = (props) => {
	return (
			<Layout.Header style={{ justifyContent: 'flex-end' }}>
					<HeaderMyInfo />
			</Layout.Header>
	);
};

