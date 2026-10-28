import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:60000,use:{baseURL:'http://127.0.0.1:4174',launchOptions:{executablePath:'C:/Users/Dell/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe'}},webServer:{command:'npm run dev -- --port 4174',url:'http://127.0.0.1:4174',reuseExistingServer:true},reporter:'list'});
