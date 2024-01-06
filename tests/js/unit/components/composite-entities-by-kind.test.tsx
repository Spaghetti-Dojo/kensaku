import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React from 'react';

import { describe, it, expect, beforeAll, jest } from '@jest/globals';

import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CompositeEntitiesByKind } from '../../../../sources/js/src/components/composite-entities-by-kind';
import { EntitiesSelectControl } from '../../../../sources/js/src/components/entities-select-control';
import { KindSelectControl } from '../../../../sources/js/src/components/kind-select-control';
import { SearchControl } from '../../../../sources/js/src/components/search-control';

describe('CompositeEntitiesByKind', () => {
	beforeAll(() => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	it('Allow to select a post type', (done) => {
		let expectedPostType: EntitiesSearch.KindControl<string>['value'];

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={() => Promise.resolve(OrderedSet([]))}
				entities={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				kind={{
					value: 'post',
					options: OrderedSet([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: (value) => (expectedPostType = value),
				}}
			>
				{(_posts, postType) => {
					return <KindSelectControl {...postType} />;
				}}
			</CompositeEntitiesByKind>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPostType).toBe('page');
			done();
		});
	});

	it('Allow to select a post', async () => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['value'];

		const rendered = await act(async () => {
			return render(
				<CompositeEntitiesByKind
					searchEntities={() =>
						Promise.resolve(
							OrderedSet([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					entities={{
						value: OrderedSet([]),
						onChange: (value) => (expectedPosts = value),
					}}
					kind={{
						value: 'post',
						options: OrderedSet([]),
						onChange: () => {},
					}}
				>
					{(posts) => {
						return (
							<>
								<EntitiesSelectControl {...posts} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			);
		});

		const postsSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		await userEvent.selectOptions(postsSelect, ['post-2']);

		expect(expectedPosts?.has('post-2')).toBe(true);
	});

	it('Reset the selected posts state when the post type changes', async () => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['value'];

		const rendered = await act(async () => {
			return render(
				<CompositeEntitiesByKind
					searchEntities={() =>
						Promise.resolve(
							OrderedSet([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					entities={{
						value: OrderedSet([]),
						onChange: (value) => (expectedPosts = value),
					}}
					kind={{
						value: 'post',
						options: OrderedSet([
							{ label: 'Post', value: 'post' },
							{ label: 'Page', value: 'page' },
						]),
						onChange: () => {},
					}}
				>
					{(posts, postType) => {
						return (
							<>
								<KindSelectControl {...postType} />
								<EntitiesSelectControl {...posts} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			);
		});

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control--kind'
		) as HTMLSelectElement;
		const postsSelect = rendered.container.querySelector(
			'.wz-select-control--entities'
		) as HTMLSelectElement;

		await userEvent.selectOptions(postsSelect, ['post-2']);
		expect(expectedPosts?.has('post-2')).toBe(true);

		await userEvent.selectOptions(postTypeSelect, 'page');
		expect(expectedPosts?.size).toBe(0);
	});

	it('Update the post options when the post type changes', (done) => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['options'];

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={(_phrase, _postType) => {
					if (_postType === 'page') {
						return Promise.resolve(
							OrderedSet([
								{ label: 'Page 1', value: 'page-1' },
								{ label: 'Page 2', value: 'page-2' },
							])
						);
					}

					return Promise.resolve(
						OrderedSet([
							{ label: 'Post 1', value: 'post-1' },
							{ label: 'Post 2', value: 'post-2' },
						])
					);
				}}
				entities={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				kind={{
					value: 'post',
					options: OrderedSet([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: () => {},
				}}
			>
				{(posts, postType) => {
					expectedPosts = posts.options;

					return (
						<>
							<KindSelectControl {...postType} />
							<EntitiesSelectControl {...posts} />
						</>
					);
				}}
			</CompositeEntitiesByKind>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPosts.size).toBe(2);
			const options = expectedPosts.toArray();
			expect(options[0]?.value).toBe('page-1');
			expect(options[1]?.value).toBe('page-2');
			done();
		});
	});

	it('Set the post options to an empty collection when there is an issue in retrieving them', (done) => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['options'];

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={() => Promise.reject('Error')}
				entities={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				kind={{
					value: 'post',
					options: OrderedSet([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: () => {},
				}}
			>
				{(posts, postType) => {
					expectedPosts = posts.options;
					return (
						<>
							<KindSelectControl {...postType} />
							<EntitiesSelectControl {...posts} />
						</>
					);
				}}
			</CompositeEntitiesByKind>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control--kind'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPosts.size).toBe(0);
			done();
		});
	});

	it('Search entities by kind by a search phrase excluding the given entities', (done) => {
		let expectedSearchPhrase: string;
		let expectedKind: string;
		let expectedQuery: Record<string, unknown> | undefined;

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={(phrase, kind, query) => {
					if (phrase === '') {
						return Promise.resolve(
							OrderedSet([
								{
									label: 'Entity 1',
									value: 'entity-1',
								},
								{
									label: 'Entity 2',
									value: 'entity-2',
								},
								{
									label: 'Entity 3',
									value: 'entity-3',
								},
							])
						);
					}

					expectedSearchPhrase = phrase;
					expectedKind = kind;
					expectedQuery = query;

					return Promise.resolve(OrderedSet([]));
				}}
				entities={{
					value: OrderedSet(['entity-3']),
					onChange: () => {},
				}}
				kind={{
					value: 'post',
					options: OrderedSet([]),
					onChange: () => {},
				}}
			>
				{(posts, postType, search) => {
					return (
						<>
							<KindSelectControl {...postType} />
							<SearchControl onChange={search} />
							<EntitiesSelectControl {...posts} />
						</>
					);
				}}
			</CompositeEntitiesByKind>
		);

		const searchInput = rendered.container.querySelector(
			'.wz-search-control__input'
		) as HTMLInputElement;

		userEvent.type(searchInput, 'Hello World').then(() => {
			expect(expectedSearchPhrase).toBe('Hello World');
			expect(expectedKind).toBe('post');
			expect(expectedQuery?.['exclude']).toEqual(
				OrderedSet(['entity-3'])
			);
			done();
		});
	});
});
