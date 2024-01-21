import React, { JSX } from 'react';

import { __ } from '@wordpress/i18n';

export function NoOptionsMessage(): JSX.Element {
	return (
		<p className="wp-entities-search-no-option-message">
			{__('No options', 'wp-entities-search')}
		</p>
	);
}
