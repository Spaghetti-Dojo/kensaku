import EntitiesSearch from '@types';

export function isControlOption(
	value: unknown
): value is EntitiesSearch.ControlOption<any> {
	if (!value) {
		return false;
	}
	if (typeof value !== 'object') {
		return false;
	}

	if (Object.keys(value).length !== 2) {
		return false;
	}
	if (!value.hasOwnProperty('label') || !value.hasOwnProperty('value')) {
		return false;
	}

	// @ts-ignore we know the `label` property exists because of the previous check.
	if (typeof value.label !== 'string') {
		return false;
	}

	return true;
}
