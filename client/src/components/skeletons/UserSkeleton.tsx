const UserSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-base-100 rounded-md shadow-md">
      <div className="w-12 h-12 bg-base-300 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-300 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-base-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default UserSkeleton;
