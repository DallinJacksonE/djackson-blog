import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  plugins: [
    // The enforce: 'pre' ensures MDX is compiled into standard JSX *before* Vite processes the React code
    {
      enforce: 'pre', ...mdx({
        remarkPlugins: [remarkGfm],
      })
    },
    react()
  ],
});
