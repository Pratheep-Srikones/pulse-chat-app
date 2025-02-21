import { ActivityIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UserSkeleton from "./skeletons/UserSkeleton";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { toastError, toastSuccess } from "../utils/notify";
import { useChatStore } from "../store/useChatStore";
import { getPersonalChatName, getOtherUserID } from "../utils/chat";

const NoChatSelected = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { user, getUserByEmail, createChat, resetUser } = useUserStore();
  const { authUser } = useAuthStore();
  const { chats, getPersonalContacts } = useChatStore();
  const [groupName, setGroupName] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([
    authUser?._id || "",
  ]);

  useEffect(() => {
    getPersonalContacts();
  }, [getPersonalContacts]);

  const handleAddContact = async () => {
    try {
      if (!user) {
        toastError("Please Select a user");
        return;
      }
      participants.push(user?._id || "");
      await createChat(participants);
      setModalOpen(false);
      setEmail("");
      resetUser();
      setParticipants([authUser?._id || ""]);
      toastSuccess("Chat created successfully");
    } catch (error) {
      console.error("Error adding contact", error);
      toastError("An unexpected error occurred");
    }
  };

  const handleAddGroup = () => {
    try {
      if (participants.length < 3) {
        toastError("Please select at least 3 participants");
      }
      createChat(participants, groupName);
      setModalOpen(false);
      setParticipants([authUser?._id || ""]);
      setGroupName("");
      toastSuccess("Group created successfully");
    } catch (error) {
      console.error("Error adding group", error);
      toastError("An unexpected error occurred");
    }
  };
  const handleModal = (action: string) => {
    setModalOpen(true);
    setAction(action);
  };
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <ActivityIcon className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Pulse!</h2>
        <p className="text-base-content/60">
          Select a conversation to start chatting
        </p>
      </div>
      <div className="flex flex-row gap-4 justify-center items-center mt-6">
        <button
          onClick={() => handleModal("contact")}
          className="btn btn-primary"
        >
          Add a new Contact
        </button>
        <button
          onClick={() => handleModal("group")}
          className="btn btn-secondary"
        >
          Create a new group
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-base-200/60 flex items-center justify-center">
          {action === "contact" && (
            <div>
              <div className="bg-base-100 p-10">
                <div className="flex flex-col">
                  <h1 className="text-lg font-semibold mb-4">
                    Add a new Contact
                  </h1>
                  <div className="join">
                    <div>
                      <div>
                        <input
                          className="input input-bordered join-item"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="indicator">
                      <button
                        className="btn join-item"
                        onClick={() => getUserByEmail(email)}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 mb-2 bg-accent-100 rounded-md">
                    {user ? (
                      <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-md">
                        <img
                          src={user.profile_pic_url}
                          alt="Profile"
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{user.full_name}</div>
                          <div className="text-sm text-base-content/60">
                            {user.bio}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <UserSkeleton />
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 mt-2">
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={handleAddContact}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        setModalOpen(false);
                        setEmail("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {action === "group" && (
            <div>
              <div className="bg-base-100 p-10">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-lg font-semibold mb-4">
                    Create a new Group
                  </h1>
                  <label className="input input-bordered flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>

                    <input
                      type="text"
                      className="grow"
                      placeholder="Group Name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </label>

                  <div className="mt-2 p-2 max-h-48 overflow-y-auto custom-scrollbar">
                    <ul className="menu bg-base-200 rounded-box w-100">
                      {
                        /* Add more items as needed */
                        chats.map((chat) => (
                          <li key={chat._id}>
                            <label className="flex items-center gap-2">
                              {chat.name ||
                                getPersonalChatName(chat, authUser?._id || "")}
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={participants.includes(
                                  getOtherUserID(chat, authUser?._id || "")
                                )}
                                onChange={(e) => {
                                  setParticipants((prevParticipants) => {
                                    const otherUserID = getOtherUserID(
                                      chat,
                                      authUser?._id || ""
                                    );

                                    if (e.target.checked) {
                                      return [...prevParticipants, otherUserID]; // Add new participant correctly
                                    } else {
                                      return prevParticipants.filter(
                                        (p) => p !== otherUserID
                                      ); // Remove participant correctly
                                    }
                                  });
                                }}
                              />
                            </label>
                          </li>
                        ))
                      }

                      {/* Add more items as needed */}
                    </ul>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 mt-2">
                    <button
                      className="btn btn-outline btn-primary"
                      onClick={handleAddGroup}
                    >
                      Create
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoChatSelected;
