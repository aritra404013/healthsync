const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/aritrachakraborty/.gemini/antigravity-ide/brain/d71d81a4-55a1-4c6e-b1c0-ab4d86a03c3b/artifacts/home_1920.png', fullPage: true });

  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/aritrachakraborty/.gemini/antigravity-ide/brain/d71d81a4-55a1-4c6e-b1c0-ab4d86a03c3b/artifacts/dash_1920.png', fullPage: true });

  await browser.close();
  console.log("Screenshots taken.");
})();
