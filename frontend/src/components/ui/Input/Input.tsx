"use client";
import classNames from "classnames";
import React, { InputHTMLAttributes, useState } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const BaseInput: React.FC<BaseInputProps> = ({
  id,
  type = "text",
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const labelStyle = classNames("text-sm font-light text-gray-600");
  const inputStyle = classNames(
    "w-full text-sm py-1 px-2 bg-transparent",
    "border-2 rounded-md",
    error ? "border-red-500" : "border-gray-300",
    "placeholder-gray-300",
    "hover:ring-blue-400 hover:ring hover:border-transparent",
    "focus:ring-blue-400 focus:ring focus:border-transparent",
    "transition-all duration-300 ease-in-out",
    "appearance-none outline-none",
  );
  const errorStyle = classNames(
    "absolute text-red-500 text-xs transition-all duration-300 ease-in-out bg-white px-2 py-1 rounded shadow-md",
    "mt-1 left-0 top-full z-40",
  );

  // Проверка валидности поля
  const validateInput = (input: HTMLInputElement) => {
    if (!input.checkValidity()) {
      setError(input.validationMessage); // Получение сообщения браузера
    } else {
      setError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    validateInput(e.target); // Валидация при потере фокуса
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (touched) validateInput(e.target); // Валидация при вводе, если поле уже было затронуто
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-start">
      <label className={labelStyle} htmlFor={id}>
        {label}
      </label>
      <div className="relative w-full">
        <input
          className={inputStyle}
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          {...props}
        />
        {touched && error && (
          <span
            className={classNames(
              errorStyle,
              error ? "opacity-100 scale-100" : "opacity-0 scale-95",
              "transition-all duration-300",
            )}
          >
            {error || ""}
          </span>
        )}
      </div>
    </div>
  );
};
