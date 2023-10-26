import EntitiesSearch from '@types';
import { Set } from 'immutable';

import { isControlOption } from './is-control-option';

/**
 * @internal
 * @param handler
 * @param options
 */
export const onChangeControlOptionsHandle = <V>(
	handler: (values: Set<V> | null) => void,
	options: Set<EntitiesSearch.ControlOption<V>> | null
): void => {
	if (options === null) return;
	const controlOptions = Set(options).filter(isControlOption);
	const values = controlOptions.map((option) => option.value);
	handler(values.size > 0 ? values : null);
};
