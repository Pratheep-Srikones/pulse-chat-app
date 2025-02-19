import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {
  getOtherUserID,
  getOtherUserProfilePic,
  getPersonalChatName,
} from "../utils/chat";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedChat!.type === "group"
                    ? selectedChat!.profile_pic_url
                    : getOtherUserProfilePic(
                        selectedChat!,
                        authUser!._id || ""
                      ) || "/avatar.png"
                }
                alt={selectedChat!.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedChat!.type === "group"
                ? selectedChat!.name
                : getPersonalChatName(selectedChat!, authUser!._id || "")}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedChat!.type === "private" && (
                <>
                  {onlineUsers?.includes(
                    getOtherUserID(selectedChat!, authUser!._id || "")
                  ) ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    "Offline"
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedChat(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
