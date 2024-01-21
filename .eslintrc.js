const baseConfiguration = require('@wordpress/scripts/config/.eslintrc.js');

module.exports = {
	...baseConfiguration,
	ignorePatterns: [
		...(baseConfiguration.ignorePatterns ?? []),
		'**/sources/server/**/*.js',
	],
	rules: {
		...baseConfiguration.rules,
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
