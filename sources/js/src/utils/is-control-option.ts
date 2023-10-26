import EntitiesSearch from '@types';

export const isControlOption = (
	value: unknown
): value is EntitiesSearch.ControlOption<any> => {
	if (!value) {
		return false;
	}
	if (typeof value !== 'object') {
		return false;
	}

	return value.hasOwnProperty('label') && value.hasOwnProperty('value');
};
