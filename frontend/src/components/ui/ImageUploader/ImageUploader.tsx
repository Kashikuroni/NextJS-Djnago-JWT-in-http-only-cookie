"use client";
import React, { useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  imageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  imageUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="image-upload"
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition duration-300"
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm font-semibold">
            Загрузить изображение
          </div>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
