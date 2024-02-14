import EntitiesSearch from '@types';

import { assert } from '../utils/assert';

export class ControlOption<V> implements EntitiesSearch.ControlOption<V> {
	public readonly label: string;
	public readonly value: V;

	static new<V>(label: string, value: V): ControlOption<V> {
		return new ControlOption(label, value);
	}

	private constructor(label: string, value: V) {
		assert(
			label !== '',
			'ControlOption: Label must be a non empty string.'
		);
		assert(
			value !== '',
			'ControlOption: Value must be a non empty string.'
		);

		this.label = label;
		this.value = value;
	}
}