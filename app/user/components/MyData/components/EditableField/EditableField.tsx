'use client';

import CloseIcon from '@/icons/CloseIcon';
import PenIcon from '@/icons/PenIcon';
import SaveIcon from '@/icons/SaveIcon';
import { useState } from 'react';
import { EditableFieldProps, UserEditableField } from './types';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input/input';

const EditableField: React.FC<EditableFieldProps> = ({
  asset: { label, value, fieldName, readOnly },
  id,
}) => {
  const router = useRouter();
  const [draft, setDraft] = useState(value || '');
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const handleEditFiled = async (
    field: UserEditableField,
    newValue: string
  ) => {
    try {
      setEditing(true);
      await fetch(`/api/user/${id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          value: newValue,
        }),
      });

      router.refresh();
      setDraft(newValue);
    } catch (error) {
      console.error(error, '1');
      setDraft(value || '-');
    } finally {
      setEditMode(false);
      setEditing(false);
    }
  };

  return (
    <div>
      {editMode ? (
        <div className="flex justify-between items-center p-2 bg-stone-100 rounded-lg min-h-12">
          {fieldName === 'phoneNumber' ? (
            <PhoneInput
              smartCaret
              international
              withCountryCallingCode
              country="UA"
              value={draft as string}
              onChange={(value) => setDraft(value as string)}
              className="w-8/12 p-2 bg-white"
            />
          ) : (
            <input
              className="w-8/12 outline-0 bg-white p-2 placeholder:text-xs"
              type={'text'}
              value={draft}
              placeholder={label}
              name={fieldName as unknown as string}
              onChange={(e) => setDraft(e.target.value)}
            />
          )}

          <div className="flex gap-2">
            <div
              className={`flex items-center bg-white p-2 rounded-lg cursor-pointer size-8 ${isEditing ? 'pointer-events-none' : 'pointer-events-auto'}`}
              onClick={() => setEditMode((prev) => !prev)}
            >
              <CloseIcon width={16} height={10} color="#171717" />
            </div>

            <div
              className={`flex items-cente bg-white p-2 rounded-lg cursor-pointer size-8 ${isEditing ? 'pointer-events-none' : 'pointer-events-auto'}`}
              onClick={() => handleEditFiled(fieldName!, draft)}
            >
              {isEditing ? <Loader /> : <SaveIcon color="#171717" />}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex group justify-between p-2 hover:bg-stone-100 rounded-lg min-h-12 ${readOnly ? 'pointer-events-none' : 'pointer-events-auto'} `}
        >
          <div className="flex gap-3 items-center">
            <p className="text-stone-900 text-xs">{label}:</p>

            <p className="text-stone-900 font-bold text-sm">{draft || '-'}</p>
          </div>

          <div
            className={`bg-white hidden group-hover:flex items-center p-2 rounded-lg cursor-pointer size-8 ${isEditing ? 'pointer-events-none' : 'pointer-events-auto'}`}
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
