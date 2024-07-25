/**
 * External dependencies
 */
import Kensaku from '@types';

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
export function useQueryViewableTaxonomies(): Kensaku.EntitiesRecords< Kensaku.ViewableTaxonomy > {
	const entitiesRecords = useEntityRecords< Kensaku.Taxonomy< 'edit' > >(
		'root',
		'taxonomy',
		{ per_page: -1 }
	);

	const viewableTaxonomies = entitiesRecords
		.records()
		.filter(
			( taxonomy ) => taxonomy.visibility.publicly_queryable
		) as Set< Kensaku.ViewableTaxonomy >;

	return {
		...entitiesRecords,
		records: () => viewableTaxonomies,
	};
}
