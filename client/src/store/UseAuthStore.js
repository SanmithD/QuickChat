
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const BASE_URL = "http://localhost:5001/";

export const useAuthStore = create((set, get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async() =>{
        try {
            const response = await axiosInstance.get(`/auth/check`);
            set({ authUser: response.data });
            get().connectSocket();
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
            get.connectSocket();
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
            toast.success("Logout successfully");
            get().disconnectSocket();
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
            get().connectSocket();
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
    },

    connectSocket: () =>{
        const { authUser } = get();
        if(!authUser || get().socket?.connected ) return;
        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds)=>{
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () =>{
        if(get().socket?.connected) get().socket.disconnect();
    },
}));