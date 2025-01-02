import { connectedBanks } from '@/db/schema';
import { config } from 'dotenv';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments } from 'plaid';


const plaidClient = new PlaidApi(
    new Configuration({
        basePath: process.env.NODE_ENV === 'production' 
            ? PlaidEnvironments.sandbox 
            : PlaidEnvironments.sandbox,
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

async function createUpdateLinkToken(
    connectedBank: typeof connectedBanks.$inferSelect,
    options?: { account_selection_enabled: boolean }
) {
    try {
      const tokenResponse = await plaidClient.linkTokenCreate({
        user: { client_user_id: connectedBank.userId },
        client_name: "FinSync",
        language: 'en',
        country_codes: [CountryCode.Us],
        access_token: connectedBank.accessToken,
        webhook: process.env.PLAID_WEBHOOK_URL,
        redirect_uri: process.env.PLAID_REDIRECT_URI,
        update: {
          account_selection_enabled: options?.account_selection_enabled || false
        }
      });
  
      return tokenResponse.data;
    } catch (error) {
      console.error('Error creating update link token:', error);
      throw error;
    }
  }

export { plaidClient, sessionOptions, createUpdateLinkToken }