const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();

  // Desktop screenshot (1440px)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000/en/about', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000); // Additional wait for animations/content
  await desktopPage.screenshot({
    path: '/Users/gihunko/projects/sg_eatwhere/.claude/screenshots/namecard-enhanced-desktop.png',
    fullPage: true
  });
  console.log('Desktop screenshot saved');
  await desktopContext.close();

  // Mobile screenshot (375px)
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/en/about', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000); // Additional wait for animations/content
  await mobilePage.screenshot({
    path: '/Users/gihunko/projects/sg_eatwhere/.claude/screenshots/namecard-enhanced-mobile.png',
    fullPage: true
  });
  console.log('Mobile screenshot saved');
  await mobileContext.close();

  await browser.close();
  console.log('All screenshots completed');
}

takeScreenshots().catch(console.error);
