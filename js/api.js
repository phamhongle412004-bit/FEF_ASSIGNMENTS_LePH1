const BASE_URL = 'https://dummyjson.com';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Yêu cầu thất bại với mã lỗi: ${response.status}`);
        }
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error("Hệ thống fetchAPI gặp lỗi:", error.message);
        throw error; 
    }
}