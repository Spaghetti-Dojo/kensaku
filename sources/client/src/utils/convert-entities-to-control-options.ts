/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * Internal dependencies
 */
import { ControlOption } from '../value-objects/control-option';
import { Set } from '../models/set';
import { assert } from './assert';
import { ImmutableRecord } from '../models/immutable-record';

export function convertEntitiesToControlOptions<
	V,
	EntitiesFields extends { [ p: string ]: any },
>(
	entities: Set< EntitiesFields >,
	labelKey: string,
	valueKey: string,
	...extraKeys: ReadonlyArray< string >
): Set< EntitiesSearch.ControlOption< V > > {
	return entities.map( ( entity ) => {
		const label = entity[ labelKey ];
		const value = entity[ valueKey ];
		assert( typeof label === 'string', 'Label key must be a string' );

		const extra = extraKeys.reduce(
			( record, key ) => ( { ...record, [ key ]: entity[ key ] } ),
			{}
		);

		return new ControlOption( label, value, new ImmutableRecord( extra ) );
	} );
}
