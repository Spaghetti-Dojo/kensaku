document.addEventListener('DOMContentLoaded', () => {
	const { wp, entitiesSearch, Immutable } = window;

	const { createElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { useBlockProps } = wp.blockEditor;
	const { Spinner } = wp.components;

	const {
		searchEntities,
		KindRadioControl,
		EntitiesToggleControl,
		SearchControl,
		CompositeEntitiesByKind,
		useQueryViewableTaxonomies,
		convertEntitiesToControlOptions,
	} = entitiesSearch;

	// TODO Check why the object form does not work.
	registerBlockType('widoz-entities-search/taxonomies-example-block', {
		apiVersion: 2,
		title: 'Taxonomies Example Block',
		category: 'uncategorized',
		icon: 'wordpress',
		editorScript: 'widoz-entities-search-e2e-taxonomies-example-block',
		edit: function Edit(props) {
			const blockProps = useBlockProps({
				className: 'widoz-entities-search-e2e-taxonomies-example-block',
			});

			const taxonomiesEntities = useQueryViewableTaxonomies();

			if (taxonomiesEntities.isResolving()) {
				return Spinner();
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
						value: Immutable.Set(props.attributes.terms),
						onChange: (terms) =>
							props.setAttributes({ terms: terms?.toArray() }),
					},
					kind: {
						value: props.attributes.taxonomy,
						options: convertEntitiesToControlOptions(
							taxonomiesEntities.records(),
							'name',
							'slug'
						),
						onChange: (taxonomy) =>
							props.setAttributes({ taxonomy }),
					},
				},
				(terms, taxonomy, search) => {
					return [
						createElement(KindRadioControl, {
							...taxonomy,
							key: 'taxonomy-radio',
						}),
						createElement(SearchControl, {
							onChange: search,
							key: 'search',
						}),
						createElement(EntitiesToggleControl, {
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
