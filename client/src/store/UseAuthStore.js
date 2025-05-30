
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],

    isCheckingAuth: true,
    checkAuth: async() =>{
        try {
            const response = await axiosInstance.get(`/auth/check`);
            set({ authUser: response.data });
        } catch (error) {
            console.log(error);
            set({ authUser: null })
        }finally{
            set({ isCheckingAuth: false });
        }
    },

    signup: async(data) =>{
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post(`/auth/signup`,data);
            set({ authUser: response.data })
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.message)
        }finally{
            set({ isSigningUp: false });
        }
    },
    logout: async() =>{
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logout successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    login: async(data) =>{
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post(`/auth/login`,data);
            set({ authUser: response.data })
            toast.success("Login successfully");
        } catch (error) {
            toast.error(error.message)
        }finally{
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async(data) =>{
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: response.data });
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }finally{
            set({ isUpdatingProfile: false })
        }
    }
}));