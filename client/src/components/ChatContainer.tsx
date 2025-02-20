import { useEffect, useRef } from "react";
import { Message, useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../utils/format";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedChat,
    subscribeToMessages,
    unsubscribeFromMessages,
    findLastReadMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const lastMessageRef = useRef<Message | undefined>(findLastReadMessage());
  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [getMessages, selectedChat, subscribeToMessages, unsubscribeFromMessages]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current && messages.length) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    lastMessageRef.current = findLastReadMessage();
  }, [findLastReadMessage, messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId._id === authUser!._id ? "chat-end" : "chat-start"
            }`}
            ref={
              message._id === lastMessageRef.current?._id ? messageEndRef : null
            }
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId.profile_pic_url
                      ? message.senderId.profile_pic_url
                      : "./avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              <span className="font-bold text-sm text-accent">
                {message.senderId._id === authUser!._id
                  ? "You"
                  : message.senderId.full_name}
              </span>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
