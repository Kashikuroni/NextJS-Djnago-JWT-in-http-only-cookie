"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/backend-api/authApi";
import { BaseInput } from "@/components/ui/Input/Input";
import { useAuth } from "@/context/AuthProvider";

export const LoginForm: React.FC = () => {
  const { refreshUser } = useAuth()
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.login(formData);
      await refreshUser();
      router.push("/");
    } catch (error) {
      setError(error as string);
      console.error(error);
    }
  };
  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-70">
      <h2 className="text-2xl font-bold mb-2">Вход</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <BaseInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <BaseInput
          label="Пароль"
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div className="flex gap-4 mt-2 justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Войти
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleRegister}
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
};
