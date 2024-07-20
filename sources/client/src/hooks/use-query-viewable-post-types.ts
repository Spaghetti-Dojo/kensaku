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
 * Hook to obtain the `viewable` post types only.
 * This is an api on top of `useEntityRecords` to facilitate the usage of the `viewable` post types.
 *
 * @public
 */
export function useQueryViewablePostTypes(): Kensaku.EntitiesRecords< Kensaku.ViewablePostType > {
	const entitiesRecords = useEntityRecords<
		Kensaku.PostType< 'edit' >
	>( 'root', 'postType', { per_page: -1 } );

	const viewablePostTypes = entitiesRecords
		.records()
		.filter(
			( postType ) => postType.viewable
		) as Set< Kensaku.ViewablePostType >;

	return {
		...entitiesRecords,
		records: () => viewablePostTypes,
	};
}
