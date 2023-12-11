import EntitiesSearch from '@types';
import { OrderedSet } from 'immutable';
import React from 'react';

import { describe, it, expect, jest } from '@jest/globals';

import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CompositePostsPostTypes } from '../../../../sources/js/src/components/composite-posts-post-types';
import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';
import { PostsSelect } from '../../../../sources/js/src/components/posts-select';

jest.mock('@wordpress/element', () => ({
	useState: React.useState,
	useEffect: React.useEffect,
}));

describe.skip('CompositePostsPostTypes', () => {
	/**
	 * This test want to ensure it is possible to select a post type.
	 */
	it('Allow to select a post type', (done) => {
		let expectedPostType: EntitiesSearch.PostTypeControl<string>['value'];

		const rendered = render(
			<CompositePostsPostTypes
				searchPosts={() => Promise.resolve(OrderedSet([]))}
				posts={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				postType={{
					value: 'post',
					options: OrderedSet([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: (value) => (expectedPostType = value),
				}}
			>
				{(_posts, postType) => {
					return <PostTypeSelect {...postType} />;
				}}
			</CompositePostsPostTypes>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-post-type-select'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPostType).toBe('page');
			done();
		});
	});

	/**
	 * This test want to ensure it is possible to select a post having a post type set.
	 */
	it('Allow to select a post', async () => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['value'];

		const rendered = await act(async () => {
			return render(
				<CompositePostsPostTypes
					searchPosts={() =>
						Promise.resolve(
							OrderedSet([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					posts={{
						value: OrderedSet([]),
						onChange: (value) => (expectedPosts = value),
					}}
					postType={{
						value: 'post',
						options: OrderedSet([]),
						onChange: () => {},
					}}
				>
					{(posts) => {
						return (
							<>
								<PostsSelect {...posts} />
							</>
						);
					}}
				</CompositePostsPostTypes>
			);
		});

		const postsSelect = rendered.container.querySelector(
			'.wz-posts-select'
		) as HTMLSelectElement;

		await userEvent.selectOptions(postsSelect, ['post-2']);

		expect(expectedPosts?.has('post-2')).toBe(true);
	});

	/**
	 * This test want to ensure the selected posts state is reset to an empty collection when the post type change.
	 */
	it('Reset the selected posts state when the post type changes', async () => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['value'];

		const rendered = await act(async () => {
			return render(
				<CompositePostsPostTypes
					searchPosts={() =>
						Promise.resolve(
							OrderedSet([
								{ label: 'Post 1', value: 'post-1' },
								{ label: 'Post 2', value: 'post-2' },
							])
						)
					}
					posts={{
						value: OrderedSet([]),
						onChange: (value) => (expectedPosts = value),
					}}
					postType={{
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
								<PostTypeSelect {...postType} />
								<PostsSelect {...posts} />
							</>
						);
					}}
				</CompositePostsPostTypes>
			);
		});

		const postTypeSelect = rendered.container.querySelector(
			'.wz-post-type-select'
		) as HTMLSelectElement;
		const postsSelect = rendered.container.querySelector(
			'.wz-posts-select'
		) as HTMLSelectElement;

		await userEvent.selectOptions(postsSelect, ['post-2']);
		expect(expectedPosts?.has('post-2')).toBe(true);

		await userEvent.selectOptions(postTypeSelect, 'page');
		expect(expectedPosts?.size).toBe(0);
	});

	/**
	 * This test want to ensure the post options are updated when the post type changes.
	 */
	it('Update the post options when the post type changes', (done) => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['options'];

		const rendered = render(
			<CompositePostsPostTypes
				searchPosts={(_phrase, _postType) => {
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
				posts={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				postType={{
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
							<PostTypeSelect {...postType} />
							<PostsSelect {...posts} />
						</>
					);
				}}
			</CompositePostsPostTypes>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-post-type-select'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPosts.size).toBe(2);
			const options = expectedPosts.toArray();
			expect(options[0]?.value).toBe('page-1');
			expect(options[1]?.value).toBe('page-2');
			done();
		});
	});

	/**
	 * This test want to ensure the post options are set to an empty collection when there's an issue
	 * in retrieving them.
	 */
	it('Set the post options to an empty collection when there is an issue in retrieving them', (done) => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['options'];

		const rendered = render(
			<CompositePostsPostTypes
				searchPosts={() => Promise.reject('Error')}
				posts={{
					value: OrderedSet([]),
					onChange: () => {},
				}}
				postType={{
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
							<PostTypeSelect {...postType} />
							<PostsSelect {...posts} />
						</>
					);
				}}
			</CompositePostsPostTypes>
		);

		const postTypeSelect = rendered.container.querySelector(
			'.wz-post-type-select'
		) as HTMLSelectElement;

		userEvent.selectOptions(postTypeSelect, 'page').then(() => {
			expect(expectedPosts.size).toBe(0);
			done();
		});
	});
});
