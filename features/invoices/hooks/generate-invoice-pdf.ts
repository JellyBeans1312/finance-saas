// server side only
import type { Browser as CoreBrowser, Page as CorePage } from 'puppeteer-core';
import type { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer';

import type { Invoice } from "@/features/invoices/types";
import { InvoiceEmail } from "@/components/sales/invoice-email";

const isProd = process.env.NODE_ENV === 'production';
let browserInstance: CoreBrowser | PuppeteerBrowser | null = null;

const LAMBDA_TASK_ROOT = process.env.LAMBDA_TASK_ROOT;
const CHROME_PATH = isProd 
    ? `${LAMBDA_TASK_ROOT}/node_modules/@sparticuz/chromium/bin` 
    : undefined;

const VIEWPORT = {
    width: 1200,
    height: 1553,
    deviceScaleFactor: 1,
} as const;

const PDF_OPTIONS = {
    format: 'A4' as const,
    margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px',
    },
    printBackground: true,
    preferCSSPageSize: true,
} as const;

async function initBrowser(): Promise<CoreBrowser | PuppeteerBrowser> {
    try {
        if (isProd) {
            const chromium = await import ('@sparticuz/chromium');
            const puppeteer = await import('puppeteer-core');

            return await puppeteer.launch({
                args: chromium.default.args,
                defaultViewport: chromium.default.defaultViewport,
                executablePath: await chromium.default.executablePath(),
                headless: chromium.default.headless,
            });
        } else {
            const puppeteer = await import('puppeteer');
            return await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox'],
            });
        }
    } catch (error) {
        console.error('Browser initialization failed:', error);
        throw new Error('Failed to initialize PDF generator');
    }
}

async function getBrowser(): Promise<CoreBrowser | PuppeteerBrowser> {
    try {
        if (!browserInstance || !browserInstance.isConnected) {
            browserInstance = await initBrowser();
        }
        return browserInstance;
    } catch (error) {
        console.error('Error getting browser instance:', error);
        throw new Error('PDF generation service unavailable');
    }
}

async function setupPage(page: CorePage | PuppeteerPage, invoice: Invoice): Promise<void> {
    await page.setViewport(VIEWPORT);

    const htmlContent = InvoiceEmail({ invoice });
    
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000, 
    });
}

export async function generateInvoicePDF(invoice: Invoice, message?: string): Promise<Buffer> {
    const browser = await getBrowser();
    let page: CorePage | PuppeteerPage | null = null;

    try {
        page = await browser.newPage();
        await setupPage(page, invoice);

        const pdfBuffer = await page.pdf(PDF_OPTIONS);
        return Buffer.from(pdfBuffer);

    } catch (error) {
        console.error('PDF generation failed:', error);
        throw new Error('Failed to generate PDF');
        
    } finally {
        if (page) {
            await page.close().catch(console.error);
        }
    }
}

async function cleanup() {
    if (browserInstance) {
        try {
            await browserInstance.close();
            browserInstance = null;
        } catch (error) {
            console.error('Browser cleanup failed:', error);
        }
    }
}

// Handle various termination signals
['exit', 'SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal => {
    process.on(signal, cleanup);
});