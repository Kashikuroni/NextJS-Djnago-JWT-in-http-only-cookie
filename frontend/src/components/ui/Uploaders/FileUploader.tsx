"use client";
import React, { useState } from "react";

interface FileUploaderProps {
  onUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="flex w-full">
      <label
        htmlFor="file-upload"
        className="w-full h-auto cursor-pointer px-4 flex flex-col text-gray-500 items-center justify-center border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 transition duration-300 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center">
          {fileName ? (
            <p className="text-sm text-gray-500">
              <span>
                Файл <b>{fileName}</b> загружен
              </span>
            </p>
          ) : (
            <span className="font-semibold text-center">
              Нажмите, чтобы загрузить или перетащите
            </span>
          )}
          <p className="text-xs text-gray-500">Принимается только .xlsx</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUploader;
