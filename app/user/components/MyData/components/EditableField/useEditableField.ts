import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserEditableField } from './types';

export const useEditableField = (id: string, value: string | null) => {
  const router = useRouter();
  const [draft, setDraft] = useState(value || '');
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const { data: session, update } = useSession();

  const handleDraft = (value: string) => {
    setDraft(value);
  };

  const cancelEditMode = () => {
    setEditMode((prev) => !prev);
    setDraft(value || '');
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleEditFiled = async (
    field: UserEditableField,
    newValue: string
  ) => {
    try {
      setEditing(true);
      setDraft(newValue);

      const response = await fetch(`/api/user/${id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          value: newValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user ${field}`);
      }

      const updatableSessionFields: readonly UserEditableField[] = [
        'name',
        'lastName',
      ];

      if (response.ok && updatableSessionFields.includes(field)) {
        await update({
          user: {
            ...session?.user,
            [field]: newValue,
          },
        });
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setDraft(value || '-');
    } finally {
      setEditMode(false);
      setEditing(false);
    }
  };

  return {
    editMode,
    draft,
    isEditing,
    handleDraft,
    cancelEditMode,
    handleEditFiled,
    toggleEditMode,
  };
};
