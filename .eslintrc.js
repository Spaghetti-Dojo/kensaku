module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	ignorePatterns: [ '**/sources/server/**/*.js' ],
	rules: {
		'@wordpress/dependency-group': 'error',
		'@wordpress/i18n-text-domain': [
			'error',
			{
				allowedTextDomain: 'wp-entities-search',
			},
		],
		'@typescript-eslint/array-type': [ 'error', { default: 'generic' } ],
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
