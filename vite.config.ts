import {defineConfig,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
export default defineConfig(({mode})=>({plugins:[react(),tailwindcss(),{name:'production-seo',closeBundle(){const origin=loadEnv(mode,process.cwd(),'VITE_').VITE_SITE_URL;if(!origin)return;const base=new URL(origin).origin;const data=fs.readFileSync('src/data.ts','utf8');const services=[...data.matchAll(/slug: "([^"]+)"/g)].map(x=>x[1]);const paths=['','about','services','industries','projects','quality-safety','gallery','videos','catalogue','careers','contact',...services.map((s,i)=>(i<8?'services/':'projects/')+s)];fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>'+base+'/'+p+'</loc></url>').join('')+'</urlset>');fs.writeFileSync('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'/sitemap.xml\n')}}],build:{rollupOptions:{output:{manualChunks:{motion:['framer-motion'],scroll:['gsap','gsap/ScrollTrigger']}}}}}));

