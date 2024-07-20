/**
 * External dependencies
 */
import Kensaku from '@types';

/**
 * Internal dependencies
 */
import { assert } from '../utils/assert';
import { ImmutableRecord } from '../models/immutable-record';

export class ControlOption< V > implements Kensaku.EnrichedControlOption< V > {
	public readonly label: string;
	public readonly value: V;
	public readonly extra: Kensaku.Record< unknown >;

	public constructor(
		label: string,
		value: V,
		extra: Kensaku.Record< unknown > = new ImmutableRecord()
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
