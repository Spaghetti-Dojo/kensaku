const prettierConfig = require('@wordpress/scripts/config/.prettierrc.js');

module.exports = {
	...prettierConfig,
	importOrder: [
		'<THIRD_PARTY_MODULES>',
		'^@jest/(.*)$',
		'^@testing-library/(.*)$',
		'^@faker-js/faker',
		'^@wordpress/(.*)$',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: false,
	importOrderCaseInsensitive: false,
};
