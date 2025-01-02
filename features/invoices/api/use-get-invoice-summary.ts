// import { useQuery } from '@tanstack/react-query';
// import { client } from '@/lib/hono';

// export const useGetInvoiceSummary = () => {
//     const query = useQuery({
//         queryKey: ['summary'],
//         queryFn: async () => {
//             const response = await client.api.invoices.summary.$get();

//             if(!response.ok) {
//                 throw new Error("Failed to fetch invoice summary")
//             }

//             const { data } = await response.json();
//             return data;
//         }
//     })
//     return query;
// }