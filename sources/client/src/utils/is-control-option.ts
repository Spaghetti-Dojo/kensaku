import EntitiesSearch from '@types';

export function isControlOption(
	option: unknown
): option is EntitiesSearch.ControlOption<any> {
	if (option === null) {
		return false;
	}

	return (
		typeof option === 'object' &&
		'value' in option &&
		'label' in option &&
		typeof option.label === 'string'
	);
}
