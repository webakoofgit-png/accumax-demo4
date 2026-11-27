import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  ssr: { noExternal: ['gsap', 'react-helmet-async'] },
  build: {
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          motion: ['framer-motion'],
          scroll: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
}));
