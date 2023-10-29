import EntitiesSearch from '@types';
import { Set } from 'immutable';
import React, { JSX } from 'react';

import { useState } from '@wordpress/element';

export const PostsPostTypesController = <P, T>(
	props: EntitiesSearch.PostsController<P, T>
): JSX.Element => {
	const [state, setState] = useState({
		posts: Set<P>(),
		types: Set<T>(),
	});

	const Posts = () => (
		<props.postsComponent
			value={state.posts}
			setValue={(posts) => setState({ ...state, posts })}
		/>
	);

	const Types = () => (
		<props.typesComponent
			value={state.types.first()}
			setValue={(type) => setState({ ...state, types: Set([type]) })}
		/>
	);

	return (
		<>
			<Types />
			<Posts />
		</>
	);
};
