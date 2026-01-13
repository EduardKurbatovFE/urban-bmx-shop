'use client';

import { useMemo } from 'react';
import { User } from '@/types/common';
import EditableField from './components/EditableField';
import UploadAvatarSection from './components/UploadAvatarSection';
import { UserEditableField } from './components/EditableField/types';

type UserAssets = {
  label: string;
  value: string | null;
  fieldName?: UserEditableField;
  readOnly?: boolean;
};

const MyData: React.FC<{ user: User }> = ({ user }) => {
  const userAssets: UserAssets[] = useMemo(() => {
    return [
      { label: "Ім'я", value: user.name, fieldName: 'name' },
      { label: 'Прізвище', value: user.lastName, fieldName: 'lastName' },
      {
        label: 'E-mail',
        value: user.email,
        readOnly: true,
      },
      { label: 'Телефон', value: user.phoneNumber, fieldName: 'phoneNumber' },
      { label: 'Місто', value: user.city, fieldName: 'city' },
    ];
  }, [user]);

  return (
    <div className="flex flex-col w-full p-6 gap-8 border border-stone-300 rounded-3xl">
      <UploadAvatarSection id={user.id} avatar={user.avatar_url} />

      <div className="flex flex-col gap-3">
        {userAssets.map((asset, index) => (
          <EditableField id={user.id} key={index} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default MyData;
