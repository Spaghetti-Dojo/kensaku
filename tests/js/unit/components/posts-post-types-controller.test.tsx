import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React from 'react';

import { describe, expect, it, jest } from '@jest/globals';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CompositePostsPostTypesControl } from '../../../../sources/js/src/components/composite-posts-post-types-control';

type State = {
	posts: Set<string>;
	types: Set<string>;
} | null;

let STATE: State = null;
const dispatch: React.Dispatch<State> = (state: State) => (STATE = state);

jest.mock('@wordpress/element', () => ({
	useState: jest.fn((initialState: State): [State, React.Dispatch<State>] => {
		return [STATE ?? initialState, dispatch];
	}),
}));

describe('Posts Post Types Controller', () => {
	it('render the given components', () => {
		const PostsComponent = () => <div>Posts Component</div>;
		const PostTypeComponent = () => <div>Post Type Component</div>;

		const { asFragment } = render(
			<CompositePostsPostTypesControl
				postsComponent={PostsComponent}
				typesComponent={PostTypeComponent}
			/>
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it('update the state when the posts component is updated', (done) => {
		const PostTypeComponent = () => null;
		const PostsSelect = (props: EntitiesSearch.PostsSelect<string>) => (
			<button
				data-testid="posts-component"
				onClick={() => props.onChange(Set(['post-one', 'post-two']))}
			>
				Update Component State
			</button>
		);

		const PostsComponent = (
			props: EntitiesSearch.ComponentStateAware<Set<string>>
		) => {
			return (
				<PostsSelect
					value={props.value}
					onChange={props.setValue}
					options={Set([])}
				/>
			);
		};

		render(
			<CompositePostsPostTypesControl
				postsComponent={PostsComponent}
				typesComponent={PostTypeComponent}
			/>
		);

		const postComponentElement = screen.getByTestId('posts-component');
		userEvent.click(postComponentElement).then(() => {
			// @ts-ignore
			expect(STATE.posts.toArray()).toEqual(['post-one', 'post-two']);
			done();
		});
	});

	it('update the state when the types component is updated', (done) => {
		const PostsComponent = () => null;
		const PostTypeSelect = (
			props: EntitiesSearch.PostTypeSelect<string>
		) => (
			<button
				data-testid="post-type-component"
				onClick={() => props.onChange('post-type')}
			>
				Update Component State
			</button>
		);

		const PostTypeComponent = (
			props: EntitiesSearch.ComponentStateAware<string>
		) => {
			return (
				<PostTypeSelect
					value={props.value}
					onChange={props.setValue}
					options={Set([])}
				/>
			);
		};

		render(
			<CompositePostsPostTypesControl
				postsComponent={PostsComponent}
				typesComponent={PostTypeComponent}
			/>
		);

		const postTypeComponentElement = screen.getByTestId(
			'post-type-component'
		);
		userEvent.click(postTypeComponentElement).then(() => {
			// @ts-ignore
			expect(STATE.types.toArray()).toEqual(['post-type']);
			done();
		});
	});
});
