//axios instance for the URL api

import axios from 'axios'
const backend_url = import.meta.env.VITE_BACKEND_URL

export const URLapi = axios.create({
    baseURL:`${backend_url}/api`,
    withCredentials:true,

})

URLapi.interceptors.request.use(async (config) => {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});