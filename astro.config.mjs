// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages serves a project repo at https://<user>.github.io/<repo>/.
// SITE and BASE come from the deploy workflow so the same code also works
// at the domain root once a custom domain is attached (set BASE to "/").
export default defineConfig({
  site: process.env.SITE ?? 'https://alvara.github.io',
  base: process.env.BASE ?? '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
