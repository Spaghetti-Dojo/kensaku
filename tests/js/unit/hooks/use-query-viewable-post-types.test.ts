import { useQueryViewablePostTypes } from '../../../../sources/js/src/hooks/use-query-viewable-post-types';
import { describe, it, jest, expect } from '@jest/globals';
import { fromPartial } from '@total-typescript/shoehorn';
import { BaseEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

jest.mock('@wordpress/data', () => {
	return {
		useSelect: jest.fn(),
	};
});

describe('Post Types Query', () => {
	it('retrieve all viewable post types', () => {
		jest.mocked(useSelect).mockReturnValue({
			getPostTypes() {
				return [
					fromPartial<BaseEntityRecords.Type<'edit'>>({
						slug: 'viewable-post-type',
						viewable: true,
					}),
					fromPartial<BaseEntityRecords.Type<'edit'>>({
						slug: 'not-viewable-post-type',
						viewable: false,
					}),
				];
			},
		});

		const viewablePostTypes = useQueryViewablePostTypes();

		expect(viewablePostTypes?.length).toEqual(1);
		expect(viewablePostTypes?.[0]?.viewable).toEqual(true);
	});

	it('returns null while resolving the post types', () => {
		jest.mocked(useSelect).mockReturnValue({
			getPostTypes: () => null,
		});

		const viewablePostTypes = useQueryViewablePostTypes();
		expect(viewablePostTypes).toEqual(null);
	});
});
