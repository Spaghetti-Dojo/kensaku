import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, it, expect, jest } from '@jest/globals';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CompositePostsPostTypes } from '../../../../sources/js/src/components/composite-posts-post-types';
import { PostTypeSelect } from '../../../../sources/js/src/components/post-type-select';
import { PostsSelect } from '../../../../sources/js/src/components/posts-select';

jest.mock('@wordpress/element', () => ({
	useState: React.useState,
	useEffect: React.useEffect,
}));

describe('CompositePostsPostTypes', () => {
	/**
	 * This test want to ensure it is possible to select a post type.
	 */
	it('Allow to select a post type', (done) => {
		let expectedPostType: EntitiesSearch.PostTypeControl<string>['value'];

		const rendered = render(
			<CompositePostsPostTypes
				posts={{
					value: Set([]),
					options: Set([]),
					onChange: () => {},
				}}
				postType={{
					value: 'post',
					options: Set([
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
	it('Allow to select a post having a post type set', (done) => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['value'];

		const rendered = render(
			<CompositePostsPostTypes
				posts={{
					value: Set([]),
					options: Set([
						{ label: 'Post 1', value: 'post-1' },
						{ label: 'Post 2', value: 'post-2' },
					]),
					onChange: (value) => (expectedPosts = value),
				}}
				postType={{
					value: null,
					options: Set([]),
					onChange: () => {},
				}}
			>
				{(posts, _postType) => {
					return (
						<>
							<PostsSelect {...posts} />
						</>
					);
				}}
			</CompositePostsPostTypes>
		);

		const postsSelect = rendered.container.querySelector(
			'.wz-posts-select'
		) as HTMLSelectElement;

		userEvent.selectOptions(postsSelect, ['post-1']).then(() => {
			expect(expectedPosts?.has('post-1')).toBe(true);
			done();
		});
	});

	/**
	 * This test want to ensure the post options are updated when the post type changes.
	 */
	it('Update the post options when the post type changes', (done) => {
		let expectedPosts: EntitiesSearch.PostsControl<string>['options'];

		const rendered = render(
			<CompositePostsPostTypes
				posts={{
					value: Set([]),
					options: Set([]),
					onChange: () => {},
				}}
				postType={{
					value: 'post',
					options: Set([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: () => {},
				}}
				searchPosts={(_phrase, _postType) => {
					if (_postType === 'page') {
						return Promise.resolve(
							Set([
								{ label: 'Page 1', value: 'page-1' },
								{ label: 'Page 2', value: 'page-2' },
							])
						);
					}

					return Promise.resolve(
						Set([
							{ label: 'Post 1', value: 'post-1' },
							{ label: 'Post 2', value: 'post-2' },
						])
					);
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
				posts={{
					value: Set([]),
					options: Set([]),
					onChange: () => {},
				}}
				postType={{
					value: 'post',
					options: Set([
						{ label: 'Post', value: 'post' },
						{ label: 'Page', value: 'page' },
					]),
					onChange: () => {},
				}}
				searchPosts={() => Promise.reject('Error')}
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
