'use client';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useHeader = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleLoginModal = () => {
    setShowLoginModal((prev) => !prev);
  };

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  const userModalAssets = [
    {
      label: 'Мій кабінет',
      action: () => router.push(`/user/${session?.user?.id}`),
    },
    { label: 'Вийти', action: handleSignOut },
  ];

  return {
    user: session?.user,
    showLoginModal,
    userModalAssets,
    toggleLoginModal,
  };
};
