import React, { JSX } from 'react';

import { __ } from '@wordpress/i18n';

export function NoOptionsMessage(): JSX.Element {
	return (
		<p className="wz-entities-search-no-option-message">
			{__('No options', 'wz-entities-search')}
		</p>
	);
}
