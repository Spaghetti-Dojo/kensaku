window.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const { PostTypesSelect, useQueryViewablePostTypes } = entitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('widoz-entities-search/post-types-example-block', {
		apiVersion: 3,
		title: 'Post Types Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'widoz-entities-search-e2e-post-types-example-block',
		edit: function Edit() {
			const blockProps = useBlockProps({
				className: 'widoz-entities-search-e2e-post-types-example-block',
			});

			const options = useQueryViewablePostTypes();

			if (options.isResolving()) {
				return Spinner();
			}

			return createElement(
				'div',
				blockProps,
				createElement(PostTypesSelect, { options: options.records() })
			);
		},
		save: () => null,
	});
});
