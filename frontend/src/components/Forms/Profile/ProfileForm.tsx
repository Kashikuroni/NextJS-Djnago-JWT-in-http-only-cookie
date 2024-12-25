"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import api from "@/services/backend-api/authApi";
import ImageUploader from "@/components/ui/Uploaders/ImageUploader";
import { BaseInput } from "@/components/ui/Input/Input";

const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
      });
    }
  }, [user]);

  const handleFileUpload = (file: File) => {
    setAvatar(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    if (avatar) {
      data.append("avatar", avatar);
    }

    try {
      await api.updateProfile(data);
      await refreshUser()
      router.push("/profile/"); // Перенаправление на страницу профиля
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="flex h-full justify-center items-center gap-4 p-4">
      <ImageUploader
        width="w-52"
        height="h-52"
        imageUrl={user?.avatar || "/default-avatar.png"}
        onUpload={handleFileUpload}
      />
      <div className="flex flex-col h-full justify-center w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <BaseInput
            label="Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <BaseInput
              label="First name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <BaseInput
              label="Last name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <p className="text-gray-600 text-sm">{user?.email}</p>
          <button
            type="submit"
            className="bg-green-500 text-white font-bold px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
