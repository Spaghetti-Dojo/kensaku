/**
 * External dependencies
 */
import React, { JSX } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export function NoOptionsMessage(): JSX.Element {
	return (
		<p className="wes-no-option-message">
			{ __( 'No options', 'wp-entities-search' ) }
		</p>
	);
}
