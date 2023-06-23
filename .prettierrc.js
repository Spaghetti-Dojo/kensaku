const prettierConfig = require('@wordpress/scripts/config/.prettierrc.js');

module.exports = {
	...prettierConfig,
	importOrder: [
		'@entities-search-types',
		'<THIRD_PARTY_MODULES>',
		'^@jest/(.*)$',
		'^@testing-library/(.*)$',
		'^@faker-js/faker',
		'^@wordpress/(.*)$',
		'^@entities-search/(.*)$',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: false,
	importOrderCaseInsensitive: false,
};
