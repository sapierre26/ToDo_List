import React from 'react';
import LeftSide from './LeftSide';
import RightSide from '.RightSide';

const SplitScreen = () => {
	return (
		<div style={{ display: 'flex', height: '100vh' }}>
			<LeftSide />
			<RightSide />
		</div>
	);
};

export default SplitScreen;
