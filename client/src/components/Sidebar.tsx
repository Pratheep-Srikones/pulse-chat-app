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
            onClick={() => setSelectedChat(chat)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedChat?._id === chat._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={
                  chat.type === "group"
                    ? chat.profile_pic_url
                    : getOtherUserProfilePic(chat, authUser!._id || "") ||
                      "/avatar.png"
                }
                alt={chat.name}
                className="size-12 object-cover rounded-full"
              />
              {chat.type === "private" &&
                onlineUsers?.includes(
                  getOtherUserID(chat, authUser!._id || "")
                ) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
                  />
                )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">
                {chat.type === "group"
                  ? chat.name
                  : getPersonalChatName(chat, authUser!._id || "")}
              </div>
              <div className="text-sm text-zinc-400">
                {chat.type === "private" && (
                  <>
                    {onlineUsers?.includes(
                      getOtherUserID(chat, authUser!._id || "")
                    ) ? (
                      <span className="text-green-600">Online</span>
                    ) : (
                      "Offline"
                    )}
                  </>
                )}
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
