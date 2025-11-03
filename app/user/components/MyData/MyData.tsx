'use client';

import { useMemo } from 'react';
import { User } from '@/types/common';
import EditableField from './components/EditableField';
import UploadAvatarSection from './components/UploadAvatarSection';

const MyData: React.FC<{ user: User }> = ({ user }) => {
  const userAssets = useMemo(() => {
    return [
      { label: "Ім'я", value: user.name },
      { label: 'Прізвище', value: user.lastName },

      { label: 'E-mail', value: user.email, readonly: true },
      { label: 'Телефон', value: user.phoneNumber },
      { label: 'Місто', value: user.city },
    ];
  }, [user]);

  return (
    <div className="flex flex-col w-full p-6 gap-8 border border-stone-300 rounded-3xl">
      <UploadAvatarSection />

      <div className="flex flex-col gap-3">
        {userAssets.map((asset, index) => (
          <EditableField id={user.id} key={index} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default MyData;
