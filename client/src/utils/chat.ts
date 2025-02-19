import { Chat } from "../store/useChatStore";

export const getPersonalChatName = (chat: Chat, currentUserID: string) => {
  const participant = chat.participants.find((p) => p._id !== currentUserID);
  return participant?.full_name || "Unknown";
};

export const getOtherUserID = (chat: Chat, currentUserID: string) => {
  const participant = chat.participants.find((p) => p._id !== currentUserID);
  return participant?._id || "";
};

export const getOtherUserProfilePic = (chat: Chat, currentUserID: string) => {
  const participant = chat.participants.find((p) => p._id !== currentUserID);
  return participant?.profile_pic_url || "";
};
