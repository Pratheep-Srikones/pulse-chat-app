import { ActivityIcon } from "lucide-react";
import { useState } from "react";
import UserSkeleton from "./skeletons/userSkeleton";

const NoChatSelected = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState("");

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
                        />
                      </div>
                    </div>
                    <div className="indicator">
                      <button className="btn join-item">Search</button>
                    </div>
                  </div>
                  <div className="mt-4 mb-2 bg-accent-100 rounded-md">
                    <UserSkeleton />
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 mt-2">
                    <button className="btn btn-outline btn-primary">Add</button>
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
                    />
                  </label>

                  <div className="mt-2 p-2 max-h-48 overflow-y-auto custom-scrollbar">
                    <ul className="menu bg-base-200 rounded-box w-100">
                      <li>
                        <a>
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <span className="label-text mr-2">
                                Remember me
                              </span>
                              <input type="checkbox" className="checkbox" />
                            </label>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <span className="label-text mr-2">
                                Remember me
                              </span>
                              <input type="checkbox" className="checkbox" />
                            </label>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <span className="label-text mr-2">
                                Remember me
                              </span>
                              <input type="checkbox" className="checkbox" />
                            </label>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <span className="label-text mr-2">
                                Remember me
                              </span>
                              <input type="checkbox" className="checkbox" />
                            </label>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>Item 2</a>
                      </li>
                      <li>
                        <a>Item 3</a>
                      </li>
                      {/* Add more items as needed */}
                    </ul>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 mt-2">
                    <button className="btn btn-outline btn-primary">
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
