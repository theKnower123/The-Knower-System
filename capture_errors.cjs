const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('DOMContentLoaded', () => {
      console.log("DOMContentLoaded, app is:", document.getElementById('app'));
    });
  });

  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR STACK:', err.stack || err.toString());
  });

  await page.goto('http://127.0.0.1:8000/login', { waitUntil: 'networkidle0', timeout: 5000 });
  
  await browser.close();
})();
