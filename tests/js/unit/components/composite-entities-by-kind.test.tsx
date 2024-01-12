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

	it('Allow to select a kind', (done) => {
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
				{(_posts, kind) => {
					return <KindSelectControl {...kind} />;
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

	it('Allow to select an entity', async () => {
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
					{(entities) => {
						return <EntitiesSelectControl {...entities} />;
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

	it('Reset the selected entities when the kind change', async () => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['value'];

		const rendered = await act(async () =>
			render(
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
					{(entities, kind) => {
						return (
							<>
								<KindSelectControl {...kind} />
								<EntitiesSelectControl {...entities} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			)
		);

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

	it('Pass to the children the updated entities options when the kind change', async () => {
		let expectedPosts: EntitiesSearch.EntitiesControl<string>['options'] =
			OrderedSet();

		const rendered = await act(() =>
			render(
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
					{(entities, kind) => {
						expectedPosts = entities.options;

						return (
							<>
								<KindSelectControl {...kind} />
								<EntitiesSelectControl {...entities} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			)
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		expect(expectedPosts.size).toBe(2);
		let options = expectedPosts.toArray();
		expect(options[0]?.value).toBe('post-1');
		expect(options[1]?.value).toBe('post-2');

		await userEvent.selectOptions(postTypeSelect, 'page');
		expect(expectedPosts.size).toBe(2);
		options = expectedPosts.toArray();
		expect(options[0]?.value).toBe('page-1');
		expect(options[1]?.value).toBe('page-2');
	});

	it('Set the entities options to an empty collection when there is an issue in retrieving them', (done) => {
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
				{(entities, kind) => {
					expectedPosts = entities.options;
					return (
						<>
							<KindSelectControl {...kind} />
							<EntitiesSelectControl {...entities} />
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
						return Promise.resolve(OrderedSet([]));
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
				{(entities, kind, search) => {
					return (
						<>
							<KindSelectControl {...kind} />
							<SearchControl onChange={search} />
							<EntitiesSelectControl {...entities} />
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

	it('Does not call searchEntities when the phrase is empty string', async () => {
		let searchEntitiesCalled = false;

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={() => {
					searchEntitiesCalled = true;
					return Promise.resolve(OrderedSet([]));
				}}
				entities={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				kind={{
					value: 'post',
					options: OrderedSet([]),
					onChange: () => {},
				}}
			>
				{(_, __, search) => {
					return <SearchControl onChange={search} />;
				}}
			</CompositeEntitiesByKind>
		);

		const searchInput = rendered.container.querySelector(
			'.wz-search-control__input'
		) as HTMLInputElement;

		await userEvent.type(searchInput, 'Hello World');
		expect(searchEntitiesCalled).toBe(true);
		searchEntitiesCalled = false;

		await userEvent.clear(searchInput);
		await userEvent.type(searchInput, ' ');
		expect(searchEntitiesCalled).toBe(false);
	});

	it('Call searchEntities with the right parameters when mounting the component', async () => {
		const entities = OrderedSet(['1', '2']);

		const searchEntities = jest.fn() as jest.Mock<
			EntitiesSearch.CompositeEntitiesKinds<
				string,
				string
			>['searchEntities']
		>;

		await act(() =>
			render(
				<CompositeEntitiesByKind
					searchEntities={searchEntities}
					entities={{
						value: entities,
						onChange: () => {},
					}}
					kind={{
						value: 'post',
						options: OrderedSet([]),
						onChange: () => {},
					}}
				>
					{(_, __, search) => {
						return <SearchControl onChange={search} />;
					}}
				</CompositeEntitiesByKind>
			)
		);

		expect(searchEntities).toHaveBeenNthCalledWith(2, '', 'post', {
			include: entities,
			per_page: '-1',
		});
	});

	it('Catch the error thrown by searchEntities when the component mount', async () => {
		let errorMessage = '';
		const searchEntities = jest.fn(() => Promise.reject('Error'));

		jest.spyOn(console, 'error').mockImplementation((_errorMessage) => {
			errorMessage = _errorMessage;
		});

		await act(() => {
			render(
				<CompositeEntitiesByKind
					searchEntities={searchEntities}
					entities={{
						value: OrderedSet([]),
						onChange: () => {},
					}}
					kind={{
						value: 'post',
						options: OrderedSet([]),
						onChange: () => {},
					}}
				>
					{(_, __, search) => {
						return <SearchControl onChange={search} />;
					}}
				</CompositeEntitiesByKind>
			);
		});

		expect(errorMessage).toMatch('Error');
	});
});
