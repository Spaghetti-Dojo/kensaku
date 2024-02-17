/**
 * External dependencies
 */
import EntitiesSearch from '@types';

export function slugifyOptionLabel< V >(
	controlOption: EntitiesSearch.ControlOption< V >
): string {
	return controlOption.label
		.toLowerCase()
		.replace( / /g, '-' )
		.replace( /[^\w-]+/g, '' );
}
