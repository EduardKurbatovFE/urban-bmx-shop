'use client';

import CloseIcon from '@/icons/CloseIcon';
import PenIcon from '@/icons/PenIcon';
import SaveIcon from '@/icons/SaveIcon';
import { useState } from 'react';
import { EditableFieldProps, UserEditableField } from './types';

const EditableField: React.FC<EditableFieldProps> = ({
  asset: { label, value, readonly },
  id,
}) => {
  const [draft, setDraft] = useState(value || '');
  const [editMode, setEditMode] = useState(false);

  const handleEditFiled = async (
    field: UserEditableField,
    value: string | number
  ) => {
    await fetch(`/api/user/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        field,
        value,
      }),
    });
  };

  return (
    <div>
      {editMode ? (
        <div className="flex justify-between items-center p-2 bg-stone-100 rounded-lg min-h-12">
          <input
            className="w-8/12 outline-0 bg-white p-2 placeholder:text-xs"
            type="text"
            value={draft}
            placeholder={label}
            onChange={() => {}}
          />

          <div className="flex gap-2">
            <div
              className="flex items-center bg-white p-2 rounded-lg cursor-pointer size-8"
              onClick={() => setEditMode((prev) => !prev)}
            >
              <CloseIcon width={16} height={10} color="#171717" />
            </div>

            <div className="flex items-cente bg-white p-2 rounded-lg cursor-pointer size-8">
              <SaveIcon color="#171717" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex group justify-between p-2 hover:bg-stone-100 rounded-lg min-h-12 ${readonly ? 'pointer-events-none' : 'pointer-events-auto'} `}
        >
          <div className="flex gap-3 items-center">
            <p className="text-stone-900 text-xs">{label}:</p>

            <p className="text-stone-900 font-bold text-sm">{value || '-'}</p>
          </div>

          <div
            className="bg-white hidden group-hover:flex items-center p-2 rounded-lg cursor-pointer size-8"
            onClick={() => setEditMode((prev) => !prev)}
          >
            <PenIcon color="#171717" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
