import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import { Invoice } from "@/features/invoices/types";
import { InvoiceEmail } from "@/components/invoice-email";

const isProd = process.env.NODE_ENV === 'production';

const getBrowser = async () => {
    if (isProd) {
        // Production: use chrome-aws-lambda
        const chromium = (await import('chrome-aws-lambda')).default;
        return puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: true
        });
    } else {
        // Development: use regular puppeteer
        const puppeteer = await import('puppeteer');
        return puppeteer.launch({
            headless: true,
        });
    }
};

export async function generateInvoicePDF(invoice: Invoice, message?: string): Promise<Buffer> {
    const browser = await getBrowser();
    try {
        const page = await browser.newPage();
        
        // Generate HTML content
        const htmlContent = InvoiceEmail({ invoice });
        
        // Set content and wait for network idle
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Generate PDF
        const pdfArray = await page.pdf({
            format: 'A4',
            margin: {
                top: '40px',
                right: '40px',
                bottom: '40px',
                left: '40px'
            },
            printBackground: true
        });

        return Buffer.from(pdfArray);
    } finally {
        await browser.close();
    }
}