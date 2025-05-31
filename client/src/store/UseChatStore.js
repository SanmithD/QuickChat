import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";

export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    favorites: [],
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
            set({ messages: [...messages, res.data.newMessage] });
        } catch (error) {
            toast.error(error.message)
        }
    },

    listenToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;

    socket.on("newMessage", (newMessage) => {
        const isMessageForCurrentChat = 
            (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
            (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);
        
        if (isMessageForCurrentChat) {
            set(state => ({ 
                messages: [...state.messages, newMessage] 
            }));
        }
    });
},

    unsubscribeMessages: () =>{
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");
    },

    getFavorites: async() =>{
        try {
            const res = await axiosInstance.get("/favorites/get");
            const favorites = Array.isArray(res.data) ? res.data : [];
            set({ favorites });
        } catch (error) {
            toast.error(error.data);
        }
    },

    toggleFavorite: async (userId) => {
  try {
    await axiosInstance.patch(`/favorites/add/${userId}`);

    // Refresh favorites list
    await get().getFavorites();

    const updatedFavorites = get().favorites;
    const isNowFavorite = updatedFavorites.some((fav) => fav._id === userId);

    toast.success(isNowFavorite ? "Added to favorites" : "Removed from favorites");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to toggle favorite");
  }
},
    setSelectedUser: (selectedUser) =>set({ selectedUser })
}));