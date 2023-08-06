const baseConfiguration = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const path = require('path');

module.exports = {
	...baseConfiguration,
	entry: './sources/js/src/index.ts',
	plugins: [
		...baseConfiguration.plugins.filter(
			(plugin) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin({
			outputFormat: 'php',
		}),
	],
	resolve: {
		...baseConfiguration.resolve,
		alias: {
			...baseConfiguration.resolve.alias,
			'@types': path.resolve(__dirname, './@types/index.d.ts'),
		},
	},
	output: {
		...baseConfiguration.output,
		library: {
			name: 'entitiesSearch',
			type: 'window',
		},
	},
};
