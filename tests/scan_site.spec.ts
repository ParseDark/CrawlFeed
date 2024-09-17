import { test, expect, type Page } from '@playwright/test';
import { writeFileSync } from 'fs';
import path from 'path';


let config = {
    seed: "https://eui.elastic.co/#/",
    baseUrl: "https://eui.elastic.co",
    outputFile: 'output.txt',
    isValidatedURL: (url) => url && url.includes('/') && url.startsWith('#'),
};

config = {
    seed: "https://docs.haystack.deepset.ai/docs",
    baseUrl: "https://docs.haystack.deepset.ai",
    outputFile: 'output.txt',
    isValidatedURL: (url) => url.startsWith('/') && !url.includes('/edit/') && !url.includes('/v1.'),
};

const saveOutput = async (str: string) => {
  const outputPath = `${__dirname}/temp/output.txt`;
  return writeFileSync(outputPath, str);
};


test.beforeEach(async ({ page }) => {
    await page.goto(config.seed);
})

test("scan....", async ({ page, context }) => {
    const baseUrl = config.baseUrl;
    const seenUrls = new Set();

    // 提取链接并处理
    const extractLinks = async (currentPage: Page) => {
        const links = await currentPage.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href'));
        });
    
        for (const href of links) {
            if (config.isValidatedURL(href) && !seenUrls.has(href)) {
                const fullUrl = `${baseUrl}${href}`;
                const response = await currentPage.context().request.get(fullUrl);
                if (response.status() !== 404) {
                    seenUrls.add(href);
                    console.log({ url: fullUrl });
                }
            }
        }
    };
    // 提取当前页面的链接
    await extractLinks(page);

    // 继续跟踪链接
    const nextLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.getAttribute('href'));
    });

    try {
        // 顺序处理链接
        for (const nextPage of nextLinks) {
            if (config.isValidatedURL(nextPage)) {
                const newPage = await context.newPage();
                try {
                    await newPage.goto(`${baseUrl}${nextPage}`, { waitUntil: 'domcontentloaded' });
                    await extractLinks(newPage);
                } catch (error) {
                    console.error(`Error navigating to ${baseUrl}${nextPage}: ${error.message}`);
                } finally {
                    await newPage.close();
                }
            }
        }
    } catch (e) {
        console.log('e', e)
    }

    // 验证提取的链接数量
    expect(seenUrls.size).toBeGreaterThan(0);

    console.log(`Total URLs extracted: ${seenUrls.size}`);

    const outputFilePath = path.join('/tmp', config.outputFile);
    saveOutput(JSON.stringify([...seenUrls].map(url => `${baseUrl}${url}`), null, 4));

    console.log(`URLs saved to ${outputFilePath}`);
});