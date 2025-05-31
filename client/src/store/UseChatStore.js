import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";

export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUser: async() =>{
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            const users = Array.isArray(res.data) ? res.data : [];
            set({ users });
        } catch (error) {
            toast.error(error.message);
            set({ users: [] });
        }finally{
            set({ isUsersLoading: false });
        }
    },

    getMessages: async(userId) =>{
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            const messages = Array.isArray(res.data) ? res.data : [];
            set({ messages});
        } catch (error) {
            toast.error(error.message);
        }finally{
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData) =>{
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.message)
        }
    },

    listenToMessages: () =>{
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        
        socket.on("newMessage", (newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            set({ messages: [...get().messages, newMessage ] });
        });
    },

    unsubscribeMessages: () =>{
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");
    },

    
    setSelectedUser: (selectedUser) =>set({ selectedUser })
}))