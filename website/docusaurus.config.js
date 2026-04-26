// @ts-check
/**
 * External dependencies
 */
const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Kensaku',
	tagline:
		'A WordPress package to search Entities including Rest API Endpoints and React Components',
	favicon: 'img/favicon.ico',
	url: 'https://spaghetti-dojo.github.io',
	baseUrl: '/kensaku/',
	organizationName: 'spaghetti-dojo',
	projectName: 'kensaku',
	onBrokenLinks: 'throw',
	markdown: {
		hooks: {
			onBrokenMarkdownLinks: 'warn',
		},
	},
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					path: '../docs',
					sidebarPath: require.resolve('./sidebars.js'),
					routeBasePath: '/',
					editUrl:
						'https://github.com/spaghetti-dojo/kensaku/tree/main/',
				},
				blog: false,
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],
	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			colorMode: {
				defaultMode: 'dark',
				disableSwitch: false,
				respectPrefersColorScheme: true,
			},
			navbar: {
				title: 'Kensaku',
				items: [
					{
						href: 'https://github.com/spaghetti-dojo/kensaku',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				copyright: `Copyright © ${new Date().getFullYear()} Kensaku. Built with Docusaurus.`,
			},
			prism: {
				theme: prismThemes.github,
				darkTheme: prismThemes.dracula,
				additionalLanguages: ['bash', 'php'],
			},
		}),
};

module.exports = config;
