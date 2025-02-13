import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, ListRestart, Mail, Upload, User, UserPen } from "lucide-react";
import { toastError } from "../../utils/notify";

const Profile = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfilePic: updateProfile,
    updateBio,
  } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

    if (file.size > MAX_FILE_SIZE) {
      toastError("File size exceeds 2MB. Please choose a smaller image.");
      return;
    }

    console.log("File: ", file);
    setSelectedImg(URL.createObjectURL(file)); // Preview image

    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert to Base64

    reader.onload = async () => {
      if (typeof reader.result === "string") {
        await updateProfile(reader.result); // Send Base64 string
      }
    };

    reader.onerror = () => {
      toastError("Failed to read the file.");
    };
  };

  const handleBioUpdate = async () => {
    if (bio === authUser?.user?.bio) {
      toastError("No changes detected");
      return;
    }

    await updateBio(bio);
  };
  const [bio, setBio] = useState(authUser?.user?.bio || "");

  return (
    <div className="h-full pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Hello !</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  typeof selectedImg === "string"
                    ? selectedImg
                    : authUser!.user.profile_pic_url || "/avatar.png"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.user?.full_name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.user?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <UserPen className="w-4 h-4" />
                Bio
              </div>
              <textarea
                className="textarea w-full"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative group">
                  <button onClick={handleBioUpdate}>
                    <Upload className="w-4 h-4 hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                    Update
                  </span>
                </div>
                <div
                  className="relative group"
                  onClick={() => setBio(authUser?.user?.bio || "")}
                >
                  <ListRestart className="w-4 h-4 hover:text-blue-500 transition-colors duration-200 cursor-pointer" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                    Reset
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser!.user?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
