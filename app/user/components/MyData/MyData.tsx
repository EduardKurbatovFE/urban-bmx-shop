'use client';

import CameraIcon from '@/icons/CameraIcon';
import { User } from '@/types/common';
import EditableField from './EditableField';
import { useMemo } from 'react';
import UploadAvatarSection from './UploadAvatarSection';

interface MyDataProps {
  user: User;
}

const MyData: React.FC<MyDataProps> = ({ user }) => {
  const userAssets = useMemo(() => {
    return [
      { label: "Ім'я", value: user.name?.split(' ')[0] },
      { label: 'Прізвище', value: user.name?.split(' ')[1] },

      { label: 'E-mail', value: user.email, readonly: true },
      { label: 'Телефон', value: '' },
      { label: 'Місто', value: '' },
    ];
  }, [user]);

  return (
    <div className="flex flex-col w-full p-6 gap-8 border border-stone-300 rounded-3xl">
      <UploadAvatarSection />

      <div className="flex flex-col gap-3">
        {userAssets.map((asset, index) => (
          <EditableField key={index} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default MyData;
