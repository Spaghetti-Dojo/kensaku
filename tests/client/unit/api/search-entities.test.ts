import EntitiesSearch from '@types';

import { describe, expect, it, jest } from '@jest/globals';

import { fetch } from '../../../../sources/client/src/api/fetch';
import { searchEntities } from '../../../../sources/client/src/api/search-entities';
import { Set } from '../../../../sources/client/src/vo/set';

jest.mock('../../../../sources/client/src/api/fetch', () => ({
	fetch: jest.fn(),
}));

describe('Search Posts', () => {
	it('perform a search with the given parameters', () => {
		// @ts-ignore
		jest.mocked(fetch).mockImplementation((options: any) => {
			const { path } = options;
			expect(path).toBe(
				'?rest_route=/wp/v2/search&per_page=10&order=DESC&orderBy=title&exclude=1%2C3&include=2%2C5&type=post&search=foo&subtype=post&_fields=title%2Cid'
			);
		});

		searchEntities('post', new Set(['post']), 'foo', {
			exclude: new Set<string>(['1', '3']),
			include: new Set<string>(['2', '5']),
		});
	});

	it('return the immutable set of entities', async () => {
		const expected = [
			{ id: 1, title: { rendered: 'Foo' } },
			{ id: 2, title: { rendered: 'Bar' } },
		];

		// @ts-ignore
		jest.mocked(fetch).mockResolvedValue(expected);

		const entities = await searchEntities<EntitiesSearch.Post>(
			'post',
			new Set(['post']),
			'foo',
			{
				exclude: new Set<string>(['1', '3']),
				include: new Set<string>(['2', '5']),
			}
		);

		entities.toArray().forEach((entity, index) => {
			expect(entity.id).toEqual(expected[index]?.id);
			expect(entity.title.rendered).toEqual(
				expected[index]?.title?.rendered
			);
		});
	});
});
