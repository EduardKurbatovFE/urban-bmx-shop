'use client';

import CameraIcon from '@/icons/CameraIcon';
import CloseIcon from '@/icons/CloseIcon';
import SaveIcon from '@/icons/SaveIcon';
import { useRef, useState } from 'react';

const UploadAvatarSection = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const readerRef = useRef<FileReader | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setSelectedPhoto(selectedFile);

      if (readerRef.current) {
        readerRef.current.abort();
      }

      const reader = new FileReader();
      readerRef.current = reader;

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemovePreview = () => {
    if (readerRef.current) {
      readerRef.current.abort();
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setPreview(null);
    setSelectedPhoto(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div
          className="flex justify-center items-center rounded-full bg-stone-300 w-48 min-h-48 hover:opacity-80 cursor-pointer"
          onClick={() => document.getElementById('avatarInput')?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <CameraIcon width={64} height={64} />
          )}
        </div>
      </div>

      <input
        id="avatarInput"
        type="file"
        className="hidden"
        accept=".jpg, .jpeg, .png"
        onChange={handleChangeFile}
        ref={inputRef}
      />

      {preview && (
        <div className="flex gap-2 mt-8 w-full justify-end items-center">
          <div
            className="flex justify-center items-center bg-stone-100 p-3 rounded-lg cursor-pointer size-10"
            onClick={handleRemovePreview}
          >
            <CloseIcon width={16} height={10} color="#171717" />
          </div>

          <div className="flex justify-center items-center bg-stone-100 p-3 rounded-lg cursor-pointer size-10">
            <SaveIcon color="#171717" />
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadAvatarSection;
