import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:"https://quickchat-1-flil.onrender.com/api",
    withCredentials: true
});