/**
 * External dependencies
 */
import Kensaku from '@types';

export function isControlOption(
	option: unknown
): option is Kensaku.ControlOption< any > {
	if ( option === null ) {
		return false;
	}

	return (
		typeof option === 'object' &&
		'value' in option &&
		'label' in option &&
		typeof option.label === 'string'
	);
}
