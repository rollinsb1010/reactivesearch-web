import React from 'react';
import types from '@rollinsb1010/reactivecore/lib/utils/types';

import Label from '../../../styles/Label';

const RangeLabel = ({ align, children, className }) => (
	// eslint-disable-next-line
	<Label align={align} className={className}>
		{children}
	</Label>
);

RangeLabel.propTypes = {
	align: types.rangeLabelsAlign,
	children: types.children,
	className: types.string,
};

export default RangeLabel;
