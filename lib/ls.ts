import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';


export const setupLemon = () => {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    
    if (!apiKey) {
        throw new Error('LEMONSQUEEZY_API_KEY is not set');
    }
    
    console.log('Setting up LemonSqueezy with API key:', apiKey.substring(0, 10) + '...');
    
    return lemonSqueezySetup({ apiKey });
}