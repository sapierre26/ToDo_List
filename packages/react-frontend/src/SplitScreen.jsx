/* src/SplitScreenBack.jsx */
import React from "react";
import PropTypes from "prop-types";
import styles from "./SplitScreen.scss"

class SplitScreen extends Component {
	render() {
		const { rightSide, leftSide } = this.props;

		return (
			<div className={styles.SplitScreen}>
				<div className={styles.rightSide}>
					{rightSide}
				</div>
				<div className={styles.leftSide}>
					{leftSide}
				</div>
			</div>
		);
	}

}

SplitScreen.propTypes = {
	rightSide: PropTypes.node.isRequired,
	leftSide: PropTypes.node.isRequired
};

export default SplitScreen
