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
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'References',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
