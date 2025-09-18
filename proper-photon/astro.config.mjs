// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://auroraplatform.github.io',

	integrations: [
		starlight({
			title: 'Aurora',
			description: 'An open-source, real-time query platform for visualizing and analyzing Kafka event streams with ClickHouse, Grafana, and AI',

			customCss: ['./src/styles/case-study.css'],
			logo: {
				light: './src/assets/aurora_logo.png',
				dark: './src/assets/aurora_logo_dark.png',
				alt: 'Aurora Platform logo',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/auroraplatform' }],
			sidebar: [
				{
					label: 'Case Study',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Introduction', slug: 'case_study/introduction' },
						{ label: 'Background', slug: 'case_study/background' },
						{ label: 'Architecture', slug: 'case_study/architecture' },
					],
				},
				{
					label: 'Docs',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Install & Deploy', slug: 'docs/install' },
						{ label: 'Connect to Kafka', slug: 'docs/connect' },
						{ label: 'Query with AI', slug: 'docs/query' },
						{ label: 'Visualize with Grafana', slug: 'docs/visualize' },
						{ label: 'Destroy & Uninstall', slug: 'docs/uninstall' },
					],
				},
			],
		}),
	],
});
