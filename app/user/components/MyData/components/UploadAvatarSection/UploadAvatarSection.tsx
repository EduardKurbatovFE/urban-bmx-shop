'use client';

import Loader from '@/components/Loader';
import CameraIcon from '@/icons/CameraIcon';
import CloseIcon from '@/icons/CloseIcon';
import SaveIcon from '@/icons/SaveIcon';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';

const UploadAvatarSection: React.FC<{ id: string; avatar: string | null }> = ({
  id,
  avatar,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(avatar);
  const readerRef = useRef<FileReader | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
        setUserPhoto(reader.result as string);
        setEditMode(true);
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

    setUserPhoto(null);
    setSelectedPhoto(null);
  };

  const handleEditFiled = async () => {
    try {
      setEditing(true);

      if (!selectedPhoto) return;

      const formData = new FormData();
      formData.append('file', selectedPhoto);

      const res = await fetch(`/api/user/${id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      const data = await res.json();

      setUserPhoto(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setEditing(false);
      setEditMode(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div
          className={`flex justify-center items-center rounded-full bg-stone-300 w-48 h-48 hover:opacity-80 cursor-pointer ${isEditing ? 'pointer-events-none' : 'pointer-events-auto'}`}
          onClick={() => document.getElementById('avatarInput')?.click()}
        >
          {userPhoto ? (
            <img
              src={userPhoto}
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

      {editMode && (
        <div className="flex gap-2 mt-8 w-full justify-end items-center">
          <div
            className="flex justify-center items-center bg-stone-100 p-3 rounded-lg cursor-pointer size-10"
            onClick={handleRemovePreview}
          >
            <CloseIcon width={16} height={10} color="#171717" />
          </div>

          <div
            className={`flex justify-center items-center bg-stone-100 p-3 rounded-lg cursor-pointer size-10 ${isEditing ? 'pointer-events-none' : 'pointer-events-auto'}`}
            onClick={handleEditFiled}
          >
            {isEditing ? <Loader /> : <SaveIcon color="#171717" />}
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadAvatarSection;
