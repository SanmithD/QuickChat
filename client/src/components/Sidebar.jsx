import { ArrowBigRight, Star, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { useChatStore } from "../store/UseChatStore";
import SearchUser from "./SearchUser";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton";

function Sidebar() {
  const {
    getUser,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    favorites,
    getFavorites,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    getUser();
    getFavorites();
  }, [getUser, getFavorites]);

  // Filter logic
  let filteredUsers = users;
  if (showOnlineOnly) {
    filteredUsers = filteredUsers.filter((user) =>
      onlineUsers.includes(user._id)
    );
  }
  if (showFavoritesOnly) {
    filteredUsers = filteredUsers.filter((user) =>
      favorites.some((fav) => fav._id === user._id)
    );
  }

  if (searchQuery.trim() !== "") {
    filteredUsers = filteredUsers.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full ${
        isSidebarExpanded ? "w-100" : "w-20"
      }  lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}
    >
      <span
        onClick={() => setIsSidebarExpanded((prev) => !prev)}
        className="cursor-pointer p-2 lg:hidden self-end"
      >
        <ArrowBigRight
          className={`size-5 transition-transform ${
            isSidebarExpanded ? "rotate-180" : ""
          }`}
        />
      </span>
      <div className="border-b border-base-200 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <SearchUser searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="mt-3 flex lg:flex flex-col gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOnlineOnly((prev) => !prev)}
              className="p-1"
            >
              <UserCheck
                className={`size-6 cursor-pointer transition-colors ${
                  showOnlineOnly
                    ? "text-green-500 fill-green-500"
                    : "text-zinc-400"
                }`}
              />
            </button>
            <span className="text-xs text-zinc-500 ml-auto">
              ({onlineUsers.length - 1} online)
            </span>
          </label>

          <label className="cursor-pointer flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className="p-1"
            >
              <Star
                className={`size-6 cursor-pointer  ${
                  showFavoritesOnly
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
