import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetConnectedBank = () => {
    const query = useQuery({
        queryKey: ['connected-bank'],
        queryFn: async () => {
            const response = await client.api.plaid['connected-bank'].$get();

            // If response is 404, return null instead of throwing
            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch bank info");
            }

            const { data } = await response.json();
            return data;
        },
        // Don't retry on 404s
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message.includes('404')) {
                return false;
            }
            return failureCount < 3;
        }
    });
    return query;
}