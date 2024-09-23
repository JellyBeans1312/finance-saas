import { config } from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';


const plaidClient = new PlaidApi(
    new Configuration({
        basePath: PlaidEnvironments.sandbox,
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
                'PLAID-SECRET': process.env.PLAID_SECRET,
                'Plaid-Version': '2020-09-14' 
            },
        },
    })
);

const sessionOptions = {
    cookieName: 'finsync_cookiename',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export { plaidClient, sessionOptions}