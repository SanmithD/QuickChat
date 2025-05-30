import { useEffect } from "react";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/UseAuthStore";
import { useChatStore } from "../store/UseChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";

function ChatContainer() {
  const { message, getMessage, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(()=>{
    getMessage(selectedUser._id);
  },[selectedUser._id, getMessage]);

  if(isMessagesLoading) return (
    <div className="flex-1 flex flex-col overflow-auto" >
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
  
  return (
    <div className="flex flex-1 flex-col overflow-auto" >
      <ChatHeader/>
      <div className="flex overflow-y-auto p-4 space-y-4 " >
         {message.map((data) => (
          <div
            key={data._id}
            className={`chat ${data.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            // ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    data.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(data.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {data.image && (
                <img
                  src={data.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {data.text && <p>{data.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer