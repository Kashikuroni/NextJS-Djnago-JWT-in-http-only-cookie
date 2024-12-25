"use client";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

import api from "@/services/backend-api/authApi";
import { loginUrl } from "@/services/constants/urls";
import { HiOutlinePencilAlt } from "react-icons/hi";

const UserProfile: React.FC = () => {
  const { user, clearAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    (async () => {
      try {
        await api.logout();
        clearAuth();
        router.push(loginUrl);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (confirmDelete) {
      try {
        await api.deleteAccount();
        clearAuth();
        router.push("/auth/login");
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <img
        src={user?.avatar || "/default-avatar.png"} // Показываем аватар или placeholder
        alt="User Avatar"
        className="w-32 h-32 rounded-2xl object-cover"
      />
      <div className="flex flex-col gap-2 h-full justify-center">
        <div className="flex flex-col text-gray-600 text-sm">
          <p>@{user?.username}</p>
          <div className="flex flex-row items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h2>
            <button
              className="px-2"
              onClick={() => router.push("/profile/update/")}
            >
              <HiOutlinePencilAlt size={30} />
            </button>
          </div>
          <p>{user?.email}</p>
        </div>
        <div className="flex gap-2">
        <button
          className="border border-red-500 text-red-500 font-bold px-5 py-1 rounded-lg hover:text-white hover:border-transparent hover:bg-red-500 transition-all duration-200 ease-in-out"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="border border-transparent bg-red-500 text-white font-bold px-5 py-1 rounded-lg hover:bg-transparent hover:text-red-500 hover:border hover:border-red-500 transition-all duration-200 ease-in-out"
          onClick={handleDelete}
        >
          Delete Account
        </button>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
