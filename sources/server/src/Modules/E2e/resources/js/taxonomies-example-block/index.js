document.addEventListener('DOMContentLoaded', () => {
	const { wp, wpEntitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		Set,
		searchEntities,
		SingularSelectControl,
		ToggleControl,
		SearchControl,
		CompositeEntitiesByKind,
		useQueryViewableTaxonomies,
		convertEntitiesToControlOptions,
	} = wpEntitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('wp-entities-search/taxonomies-example-block', {
		apiVersion: 2,
		title: 'Taxonomies Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'wp-entities-search-e2e-taxonomies-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'wp-entities-search-e2e-taxonomies-example-block',
			});

			const taxonomiesEntities = useQueryViewableTaxonomies();

			if (taxonomiesEntities.isResolving()) {
				return createElement(Spinner);
			}

			const TermTaxonomiesControllerElement = createElement(
				CompositeEntitiesByKind,
				{
					// TODO Wrap around a throttle or debounce function
					searchEntities: async (
						phrase,
						taxonomyName,
						queryArguments
					) => {
						const terms = await searchEntities(
							'term',
							taxonomyName,
							phrase,
							queryArguments
						);
						return convertEntitiesToControlOptions(
							terms,
							'title',
							'id'
						);
					},
					entities: {
						value: new Set(props.attributes.terms),
						onChange: (terms) =>
							props.setAttributes({ terms: terms?.toArray() }),
					},
					kind: {
						value: new Set(props.attributes.taxonomy),
						options: convertEntitiesToControlOptions(
							taxonomiesEntities.records(),
							'name',
							'slug'
						),
						onChange: (taxonomy) =>
							props.setAttributes({
								taxonomy: taxonomy.toArray(),
							}),
					},
				},
				(terms, taxonomy, search) => {
					return [
						createElement(SingularSelectControl, {
							...taxonomy,
							value: taxonomy.value.first(),
							key: 'taxonomy-radio',
						}),
						createElement(SearchControl, {
							onChange: search,
							key: 'search',
						}),
						createElement(ToggleControl, {
							...terms,
							key: 'terms-toggle',
						}),
					];
				}
			);

			return createElement(
				'div',
				blockProps,
				TermTaxonomiesControllerElement
			);
		},
		save: () => null,
	});
});
