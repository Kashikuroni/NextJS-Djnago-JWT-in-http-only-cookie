"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/backend-api/authApi";
import { BaseInput } from "@/components/ui/Input/Input";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password" || e.target.name === "confirm_password") {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setPasswordError("Password do not match.")
      return;
    }

    try {
      const {confirm_password, ...dataToSend } = formData;
      await api.register(dataToSend);
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Не известная ошибка, обратитесь в поддержку");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-xl font-bold mb-3">Registration</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1 w-full">
        <BaseInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
        />
        <BaseInput
          label="Username"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required={true}
        />
        <BaseInput
          label="First name"
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required={true}
        />
        <BaseInput
          label="Last name"
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required={true}
        />
        <BaseInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={true}
        />
        <BaseInput
          label="Confirm Password"
          type="password"
          id="confirm_password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required={true}
        />
        {passwordError && (
          <div className="text-red-500 text-xs italic">{passwordError}</div>
        )}
        <div className="flex items-center justify-end mt-4">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="flex flex-col gap-1 justify-center items-center">
          <p className="text-gray-400">If you already have an account</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="text-gray-700 font-bold border-b border-transparent hover:border-b hover:border-gray-700 transition-all duration-150 ease-in-out"
          >
           Login 
          </button>
        </div>
      </form>
      {error && <div className="text-red-500 text-xs italic mb-4">{error}</div>}
    </div>
  );
};

export default RegisterForm;
