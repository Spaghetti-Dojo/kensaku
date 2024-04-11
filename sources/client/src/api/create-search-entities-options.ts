/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';
import { searchEntitiesOptions } from './search-entities-options';

export function createSearchEntitiesOptions< E >( type: string ) {
	return async (
		phrase: string,
		postTypes: EntitiesSearch.Kind< string >,
		queryArguments?: EntitiesSearch.QueryArguments
	): Promise< Set< EntitiesSearch.ControlOption< E > > > =>
		searchEntitiesOptions( type, phrase, postTypes, queryArguments );
}
