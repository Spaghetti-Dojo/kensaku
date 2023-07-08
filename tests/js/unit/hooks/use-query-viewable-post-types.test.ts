import { EntitiesSearch } from '@entities-search-types';

import { fromPartial } from '@total-typescript/shoehorn';
import { Set } from 'immutable';

import { describe, it, jest, expect } from '@jest/globals';

import { useEntityRecords } from '../../../../sources/js/src/hooks/use-entity-records';
import { useQueryViewablePostTypes } from '../../../../sources/js/src/hooks/use-query-viewable-post-types';

jest.mock('@wordpress/data', () => {
	return {
		useSelect: jest.fn(),
	};
});
jest.mock('../../../../sources/js/src/hooks/use-entity-records', () => {
	return {
		useEntityRecords: jest.fn(),
	};
});

describe('Post Types Query', () => {
	it('retrieve all viewable post types', () => {
		jest.mocked(useEntityRecords).mockReturnValue({
			isResolving: () => false,
			errored: () => false,
			succeed: () => true,
			records: () =>
				Set([
					fromPartial<EntitiesSearch.PostType<'edit'>>({
						slug: 'viewable-post-type',
						viewable: true,
					}),
					fromPartial<EntitiesSearch.PostType<'edit'>>({
						slug: 'not-viewable-post-type',
						viewable: false,
					}),
				]),
		});

		const postTypes = useQueryViewablePostTypes();
		expect(postTypes.records().size).toEqual(1);
		for (const viewablePostType of postTypes.records()) {
			expect(viewablePostType.viewable).toEqual(true);
		}
	});

	it('returns empty set while resolving the post types', () => {
		jest.mocked(useEntityRecords).mockReturnValue({
			isResolving: () => true,
			errored: () => false,
			succeed: () => false,
			records: () => Set([]),
		});

		const viewablePostTypes = useQueryViewablePostTypes();
		expect(viewablePostTypes.records().size).toEqual(0);
	});
});
