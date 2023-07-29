const baseConfiguration = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

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
	output: {
		...baseConfiguration.output,
		library: {
			name: 'entitiesSearch',
			type: 'window',
		},
	},
};
