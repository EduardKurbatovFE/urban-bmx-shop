'use client';
import React from 'react';

import { PartProps } from './types';
import { useRouter } from 'next/navigation';

const PartComponent: React.FC<PartProps> = ({ part }) => {
  const router = useRouter();

  const handlePartClick = () => {
    router.push(`/parts/${part.logicalName}`);
  };

  return (
    <div
      className="flex justify-between items-center border-container rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handlePartClick}
    >
      <h2 className="text-lg font-semibold">{part.name}</h2>
      <img
        src={part.image_url}
        alt={part.name}
        className="w-16 h-16 object-fit rounded-lg"
      />
    </div>
  );
};

export default PartComponent;
