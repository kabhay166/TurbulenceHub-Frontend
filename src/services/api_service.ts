import axios from "axios";
import AppConfig from "../../config.ts";
import { router } from '../router';

const api = axios.create({
    baseURL: AppConfig.getBaseUrl(),
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // handle auth logout, refresh token, etc.
            router.navigate({to: '/user/login'});
        }
        return Promise.reject(error);
    }
);

export default api;