import EntitiesSearch from '@types';

export function isControlOption(
	value: unknown
): value is EntitiesSearch.Record<any> {
	if (!value) {
		return false;
	}
	if (typeof value !== 'object') {
		return false;
	}

	return value.hasOwnProperty('label') && value.hasOwnProperty('value');
}
