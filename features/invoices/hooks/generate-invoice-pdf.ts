// server side only
import chromium from 'chrome-aws-lambda';

import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';

import type { Invoice } from "@/features/invoices/types";
import { InvoiceEmail } from "@/components/sales/invoice-email";

const isProd = process.env.NODE_ENV === 'production';
let browserInstance: Browser | null = null;

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

async function initBrowser() {
    try {
        if (isProd) {    
            return await puppeteer.launch({
                args: [...chromium.args, '--no-sandbox'],
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });
        } else {
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

async function getBrowser(): Promise<Browser> {
    try {
        if (!browserInstance || !browserInstance.isConnected()) {
            browserInstance = await initBrowser();
        }
        return browserInstance;
    } catch (error) {
        console.error('Error getting browser instance:', error);
        throw new Error('PDF generation service unavailable');
    }
}

async function setupPage(page: Page, invoice: Invoice): Promise<void> {
    await page.setViewport(VIEWPORT);

    const htmlContent = InvoiceEmail({ invoice });
    
    await page.setContent(htmlContent, {
        waitUntil: ['load', 'networkidle0'],
        timeout: 30000, 
    });
}

export async function generateInvoicePDF(invoice: Invoice, message?: string): Promise<Buffer> {
    const browser = await getBrowser();
    let page: Page | null = null;

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