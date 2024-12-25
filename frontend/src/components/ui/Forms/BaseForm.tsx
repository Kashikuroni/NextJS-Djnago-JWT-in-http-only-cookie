"use client";
import React, { useState } from "react";
import { BaseInput } from "@/components/ui/Input/Input";

type FormField<T> = {
  label: string;
  name: keyof T;
  type: string;
  required?: boolean;
};

type BaseFormProps<T> = {
  title: string;
  fields: FormField<T>[];
  onSubmit: (formData: T) => Promise<void>;
};

const BaseForm = <T extends object>({
  title,
  fields,
  onSubmit,
}: BaseFormProps<T>) => {
  const [formData, setFormData] = useState<T>({} as T)
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        {fields.map(({ label, name, type, required }) => (
          <BaseInput
            key={String(name)}
            label={label}
            name={String(name)}
            type={type}
            value={formData[name] as string || ""}
            onChange={handleChange}
            required={required}
          />
        ))}
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-xs italic mt-4">{error}</div>
        )}
      </form>
    </div>
  );
};

export default BaseForm;
