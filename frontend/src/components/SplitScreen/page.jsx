import React from 'react';
import SplitPane from 'react-split-pane';

function SplitApp() {
	return (
		<div style={{ height: '100vh' }}>
			<SplitPane split="vertical" defaultSize={200}>
				<div style={{ backgroundColor: '#eee' }}>
					<h1>Left Side</h1>
				</div>
				<div style={{ backgroundColor: '#fafafa' }}>
					<h1>Right Side</h1>
				</div>
			</SplitPane>
		</div>
	);
}


export default SplitApp;
