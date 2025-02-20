import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import {
  getOtherUserID,
  getOtherUserProfilePic,
  getPersonalChatName,
} from "../utils/chat";

const Sidebar = () => {
  const {
    selectedChat,
    allChats,
    getAllChats,
    isChatsLoading,
    setSelectedChat,
    markAsRead,
    resetUnreadCount,
  } = useChatStore();

  const { onlineUsers, authUser } = useAuthStore();

  useEffect(() => {
    getAllChats();
  }, [getAllChats]);

  if (isChatsLoading) {
    return (
      <div>
        <SidebarSkeleton />
      </div>
    );
  }
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {allChats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => {
              setSelectedChat(chat);
              markAsRead(chat._id);
              resetUnreadCount(chat._id);
            }}
            className={`
    w-full p-3 flex items-center gap-3
    rounded-lg transition-all duration-200 ease-in-out
    hover:bg-base-300 hover:shadow-md
    ${
      selectedChat?._id === chat._id
        ? "bg-base-300 ring-1 ring-base-300"
        : "bg-base-100"
    }
  `}
          >
            <div className="relative">
              <img
                src={
                  chat.type === "group"
                    ? chat.profile_pic_url
                    : getOtherUserProfilePic(chat, authUser!._id || "") ||
                      "/avatar.png"
                }
                alt={chat.name}
                className="w-12 h-12 object-cover rounded-full"
              />
              {chat.type === "private" &&
                onlineUsers?.includes(
                  getOtherUserID(chat, authUser!._id || "")
                ) && (
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
            rounded-full ring-2 ring-zinc-900"
                  />
                )}
              {/* Unread Message Count */}
              {chat.unreadCounts &&
                (chat.unreadCounts[authUser!._id] || 0) > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-accent text-white text-xs 
          font-bold px-1.5 py-0.5 rounded-full shadow-md"
                  >
                    {chat.unreadCounts[authUser!._id]}
                  </span>
                )}
            </div>

            <div className="text-left min-w-0 flex-1">
              <div className="font-medium truncate">
                {chat.type === "group"
                  ? chat.name
                  : getPersonalChatName(chat, authUser!._id || "")}
              </div>

              <div className="text-sm text-zinc-400 truncate max-w-xs">
                {chat.lastMessage?.text
                  ? chat.lastMessage.text
                  : chat.lastMessage?.image
                  ? "Image"
                  : "No messages"}
              </div>
            </div>
          </button>
        ))}

        {allChats.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
