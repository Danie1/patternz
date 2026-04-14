// @ts-check
import { defineConfig } from 'astro/config';
import process from 'node:process';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import preact from '@astrojs/preact';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const site = process.env.SITE_URL ?? 'https://example.com';
const base = process.env.BASE_PATH ?? (repoName ? `/${repoName}` : '/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    }
  },

  integrations: [mdx(), preact()]
});