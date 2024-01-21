import EntitiesSearch from '@types';
import React from 'react';

import { describe, it, expect, jest } from '@jest/globals';

import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { doAction } from '@wordpress/hooks';

import { CompositeEntitiesByKind } from '../../../../sources/client/src/components/composite-entities-by-kind';
import { PluralSelectControl } from '../../../../sources/client/src/components/plural-select-control';
import { SearchControl } from '../../../../sources/client/src/components/search-control';
import { SingularSelectControl } from '../../../../sources/client/src/components/singular-select-control';
import { Set } from '../../../../sources/client/src/vo/set';

jest.mock('@wordpress/hooks', () => ({
	doAction: jest.fn(),
}));
jest.mock('@wordpress/compose', () => ({
	useThrottle: (fn: (phrase: any) => void) => fn,
}));

describe('CompositeEntitiesByKind', () => {
	it('Allow to select a kind', async () => {
		let expectedKinds = new Set();

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={() => Promise.resolve(new Set())}
				entities={{
					value: new Set(),
					onChange: () => {},
				}}
				kind={{
					value: new Set(['post']),
					options: new Set([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: (value) => (expectedKinds = value),
				}}
			>
				{(_posts, kind) => {
					return (
						<SingularSelectControl
							{...kind}
							value={kind.value.first() ?? ''}
							onChange={(value) =>
								kind.onChange(new Set([value]))
							}
						/>
					);
				}}
			</CompositeEntitiesByKind>
		);

		const kindSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		await userEvent.selectOptions(kindSelect, 'page');
		expect(expectedKinds.first()).toBe('page');
	});

	it('Allow to select an entity', async () => {
		let expectedEntities = new Set();

		const rendered = await act(async () =>
			render(
				<CompositeEntitiesByKind
					searchEntities={() =>
						Promise.resolve(
							new Set([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					entities={{
						value: new Set<string>(),
						onChange: (value) => (expectedEntities = value),
					}}
					kind={{
						value: new Set(['post']),
						options: new Set(),
						onChange: () => {},
					}}
				>
					{(entities) => {
						return <PluralSelectControl {...entities} />;
					}}
				</CompositeEntitiesByKind>
			)
		);

		const entitiesSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		await userEvent.selectOptions(entitiesSelect, ['post-2']);

		expect(expectedEntities?.has('post-2')).toBe(true);
	});

	it('Reset the selected entities when the kind change', async () => {
		let expectedEntities = new Set();

		const rendered = await act(async () =>
			render(
				<CompositeEntitiesByKind
					searchEntities={() =>
						Promise.resolve(
							new Set([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					entities={{
						value: new Set<string>(),
						onChange: (value) => (expectedEntities = value),
					}}
					kind={{
						value: new Set(['post']),
						options: new Set([
							{ label: 'Post', value: 'post' },
							{ label: 'Page', value: 'page' },
						]),
						onChange: () => {},
					}}
				>
					{(entities, kind) => {
						return (
							<>
								<SingularSelectControl
									{...kind}
									value={kind.value.first() ?? ''}
									onChange={(value) =>
										kind.onChange(new Set([value]))
									}
								/>
								<PluralSelectControl {...entities} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			)
		);

		const kindSelect = rendered.container.querySelector(
			'.wz-select-control--singular'
		) as HTMLSelectElement;
		const entitiesSelect = rendered.container.querySelector(
			'.wz-select-control--plural'
		) as HTMLSelectElement;

		await userEvent.selectOptions(entitiesSelect, ['post-2']);
		expect(expectedEntities.has('post-2')).toBe(true);

		await userEvent.selectOptions(kindSelect, 'page');
		expect(expectedEntities.length()).toBe(0);
	});

	it('Pass to the children the updated entities options when the kind change', async () => {
		let expectedEntities = new Set<EntitiesSearch.ControlOption<string>>();

		const rendered = await act(() =>
			render(
				<CompositeEntitiesByKind
					searchEntities={(_phrase, _postType) => {
						if (_postType.first() === 'page') {
							return Promise.resolve(
								new Set([
									{ label: 'Page 1', value: 'page-1' },
									{ label: 'Page 2', value: 'page-2' },
								])
							);
						}

						return Promise.resolve(
							new Set([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						);
					}}
					entities={{
						value: new Set<string>(),
						onChange: () => {},
					}}
					kind={{
						value: new Set<string>(['post']),
						options: new Set([
							{ label: 'Post', value: 'post' },
							{ label: 'Page', value: 'page' },
						]),
						onChange: () => {},
					}}
				>
					{(entities, kind) => {
						expectedEntities = entities.options;

						return (
							<>
								<SingularSelectControl
									{...kind}
									value={kind.value.first() ?? ''}
									onChange={(value) =>
										kind.onChange(new Set([value]))
									}
								/>
								<PluralSelectControl {...entities} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			)
		);

		const kindSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		expect(expectedEntities.length()).toBe(2);
		let options = expectedEntities.toArray();
		expect(options[0]?.value).toBe('post-1');
		expect(options[1]?.value).toBe('post-2');

		await userEvent.selectOptions(kindSelect, 'page');
		expect(expectedEntities.length()).toBe(2);
		options = expectedEntities.toArray();
		expect(options[0]?.value).toBe('page-1');
		expect(options[1]?.value).toBe('page-2');
	});

	it('Set the entities options to an empty collection when there is an issue in retrieving them', async () => {
		let expectedEntities = new Set();

		const rendered = await act(() =>
			render(
				<CompositeEntitiesByKind
					// @ts-ignore
					searchEntities={(phrase, kind) => {
						switch (kind.first()) {
							case 'post':
								return Promise.resolve(
									new Set([
										{ label: 'Post 1', value: 'post-1' },
										{ label: 'Post 2', value: 'post-2' },
									])
								);
							case 'page':
								return Promise.reject('Error');
						}
					}}
					entities={{
						value: new Set<string>(),
						onChange: () => {},
					}}
					kind={{
						value: new Set(['post']),
						options: new Set([
							{ label: 'Post', value: 'post' },
							{ label: 'Page', value: 'page' },
						]),
						onChange: () => {},
					}}
				>
					{(entities, kind) => {
						expectedEntities = entities.options;
						return (
							<>
								<SingularSelectControl
									{...kind}
									value={kind.value.first() ?? ''}
									onChange={(value) =>
										kind.onChange(new Set([value]))
									}
								/>
								<PluralSelectControl {...entities} />
							</>
						);
					}}
				</CompositeEntitiesByKind>
			)
		);

		const kindSelect = rendered.container.querySelector(
			'.wz-select-control--singular'
		) as HTMLSelectElement;

		await userEvent.selectOptions(kindSelect, 'page');
		expect(expectedEntities.length()).toBe(0);

		expect(jest.mocked(doAction)).toHaveBeenCalledWith(
			'wp-entities-search.on-change-kind.error',
			'Error'
		);
	});

	it('Does not search for entities when changing the entities selection produce an empty collection', async () => {
		let selectedEntities = new Set(['post-1', 'post-2']);
		const searchEntities = jest.fn(() =>
			Promise.resolve(
				new Set([
					{ label: 'Post 1', value: 'post-1' },
					{ label: 'Post 2', value: 'post-2' },
				])
			)
		) as jest.Mock<EntitiesSearch.SearchEntitiesFunction<string, string>>;

		const rendered = await act(() =>
			render(
				<CompositeEntitiesByKind
					searchEntities={searchEntities}
					entities={{
						value: selectedEntities,
						onChange: (entities) => {
							selectedEntities = entities;
						},
					}}
					kind={{
						value: new Set(['post']),
						options: new Set(),
						onChange: () => {},
					}}
				>
					{(entities) => {
						return <PluralSelectControl {...entities} />;
					}}
				</CompositeEntitiesByKind>
			)
		);

		const entitiesSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		expect(selectedEntities.length()).toBe(2);
		expect(selectedEntities.has('post-1')).toEqual(true);
		expect(selectedEntities.has('post-2')).toEqual(true);

		await userEvent.deselectOptions(entitiesSelect, ['post-1', 'post-2']);
		expect(selectedEntities.length()).toBe(0);
	});

	it('Call searchEntities with the right parameters when mounting the component', async () => {
		const selectedEntities = new Set(['1', '2']);

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
						value: selectedEntities,
						onChange: () => {},
					}}
					kind={{
						value: new Set(['post']),
						options: new Set(),
						onChange: () => {},
					}}
				>
					{(_, __, search) => {
						return <SearchControl onChange={search} />;
					}}
				</CompositeEntitiesByKind>
			)
		);

		expect(searchEntities).toHaveBeenNthCalledWith(
			2,
			'',
			new Set(['post']),
			{
				include: selectedEntities,
				per_page: '-1',
			}
		);
	});

	it('Catch the error thrown by searchEntities when the component mount', async () => {
		await act(() => {
			render(
				<CompositeEntitiesByKind
					searchEntities={() => Promise.reject('Error')}
					entities={{
						value: new Set(),
						onChange: () => {},
					}}
					kind={{
						value: new Set(['post']),
						options: new Set(),
						onChange: () => {},
					}}
				>
					{(_, __, search) => {
						return <SearchControl onChange={search} />;
					}}
				</CompositeEntitiesByKind>
			);
		});

		expect(doAction).toHaveBeenCalledWith(
			'wp-entities-search.on-storage-initialization.error',
			'Error'
		);
	});

	it('Catch on change entities error', async () => {
		const rendered = await act(() =>
			render(
				<CompositeEntitiesByKind
					// @ts-ignore
					searchEntities={(phrase, kind, queryArguments) => {
						if (queryArguments?.include?.first() === 'post-1') {
							return Promise.reject('Error');
						}

						return Promise.resolve(
							new Set([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						);
					}}
					entities={{
						value: new Set<string>(),
						onChange: () => {},
					}}
					kind={{
						value: new Set(['post']),
						options: new Set([
							{ label: 'Post', value: 'post' },
							{ label: 'Page', value: 'page' },
						]),
						onChange: () => {},
					}}
				>
					{(entities) => {
						return <PluralSelectControl {...entities} />;
					}}
				</CompositeEntitiesByKind>
			)
		);

		const entitiesSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		await userEvent.selectOptions(entitiesSelect, ['post-1']);

		expect(jest.mocked(doAction)).toHaveBeenCalledWith(
			'wp-entities-search.on-change-entities.error',
			'Error'
		);
	});

	it('Set to an empty collection the Kind when all kinds are unselected', async () => {
		let expectedKinds = new Set<string>();

		const rendered = render(
			<CompositeEntitiesByKind
				searchEntities={() => Promise.resolve(new Set())}
				entities={{
					value: new Set(),
					onChange: () => {},
				}}
				kind={{
					value: new Set(['post']),
					options: new Set([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: (value) => (expectedKinds = value),
				}}
			>
				{(_posts, kind) => {
					return <PluralSelectControl {...kind} />;
				}}
			</CompositeEntitiesByKind>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-select-control'
		) as HTMLSelectElement;

		await userEvent.deselectOptions(postTypeSelect, ['post']);
		expect(expectedKinds.length()).toBe(0);
	});
});
