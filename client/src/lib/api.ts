const BASE_URL = process.env.NODE_ENV === 'production' 
? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
: '';

export const apiRequest = async (
method: string,
path: string,
body?: unknown
) => {
const response = await fetch(`${BASE_URL}${path}`, {
  method,
  headers: {
    'Content-Type': 'application/json',
  },
  body: body ? JSON.stringify(body) : undefined,
});

if (!response.ok) {
  throw new Error('API request failed');
}

return response.json();
};