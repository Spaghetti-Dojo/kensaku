/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * Internal dependencies
 */
import { assert } from '../utils/assert';
import { ImmutableRecord } from '../models/immutable-record';

export class ControlOption< V >
	implements EntitiesSearch.EnrichedControlOption< V >
{
	public readonly label: string;
	public readonly value: V;
	public readonly extra: EntitiesSearch.Record< unknown >;

	public constructor(
		label: string,
		value: V,
		extra: EntitiesSearch.Record< unknown > = new ImmutableRecord()
	) {
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
		this.extra = extra;
	}
}
