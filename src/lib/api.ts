const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
    baseURL: API_URL,
    
    // Helper pour les requêtes authentifiées
    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('accessToken');
        
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
    }
};
