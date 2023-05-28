const baseConfiguration = require('@wordpress/scripts/config/.eslintrc.js');

module.exports = {
	...baseConfiguration,
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
