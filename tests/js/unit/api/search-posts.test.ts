import EntitiesSearch from '@types';
import { Set } from 'immutable';

import { describe, expect, it, jest } from '@jest/globals';

import { fetch } from '../../../../sources/js/src/api/fetch';
import { searchEntities } from '../../../../sources/js/src/api/search-posts';

jest.mock('../../../../sources/js/src/api/fetch', () => ({
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

		searchEntities('post', 'post', 'foo', {
			exclude: Set<string>(['1', '3']),
			include: Set<string>(['2', '5']),
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
			'post',
			'foo',
			{
				exclude: Set<string>(['1', '3']),
				include: Set<string>(['2', '5']),
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
