/**
 * External dependencies
 */
import Kensaku from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';
import { searchEntitiesOptions } from './search-entities-options';

export function createSearchEntitiesOptions< E >( type: string ) {
	return async (
		phrase: string,
		postTypes: Kensaku.Kind< string >,
		queryArguments?: Kensaku.QueryArguments
	): Promise< Set< Kensaku.ControlOption< E > > > =>
		searchEntitiesOptions( type, phrase, postTypes, queryArguments );
}
