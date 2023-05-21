const path = require('path')
const baseConfiguration = require('@wordpress/scripts/config/webpack.config')
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin')

module.exports = {
  ...baseConfiguration,
  plugins: [
    ...baseConfiguration.plugins.filter(
      plugin => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
    ),
    new DependencyExtractionWebpackPlugin({
      outputFormat: 'json',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '@entities-search': path.resolve(__dirname, 'sources/js/src'),
      '@types': path.resolve(__dirname, 'sources/js/src/@types'),
    },
  },
}
