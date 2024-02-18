/**
 * External dependencies
 */
import EntitiesSearch from '@types';

/**
 * Internal dependencies
 */
import { Set } from '../models/set';
import { useEntityRecords } from './use-entity-records';

/**
 * Hook to obtain the `viewable` taxonomies only.
 * This is an api on top of `useEntityRecords` to facilitate the usage of the `viewable` taxonomies.
 *
 * @public
 */
export function useQueryViewableTaxonomies(): EntitiesSearch.EntitiesRecords< EntitiesSearch.ViewableTaxonomy > {
	const entitiesRecords = useEntityRecords<
		EntitiesSearch.Taxonomy< 'edit' >
	>( 'root', 'taxonomy', { per_page: -1 } );

	const viewableTaxonomies = entitiesRecords
		.records()
		.filter(
			( taxonomy ) => taxonomy.visibility.publicly_queryable
		) as Set< EntitiesSearch.ViewableTaxonomy >;

	return {
		...entitiesRecords,
		records: () => viewableTaxonomies,
	};
}
