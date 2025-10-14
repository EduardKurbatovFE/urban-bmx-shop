'use client';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export const useHeader = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();

  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev);
  };

  const userModalAssets = [
    { label: 'Мій кабінет', action: () => {} },
    { label: 'Вийти', action: signOut },
  ];

  console.log(session);

  return {
    user: session?.user,
    showLoginModal,
    userModalAssets,
    toggleLoginModal,
  };
};
