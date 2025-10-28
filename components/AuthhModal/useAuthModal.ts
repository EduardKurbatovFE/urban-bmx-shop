'use client';

import { FieldValues } from 'react-hook-form';
import { useState } from 'react';
import useSnackbar from '../Snackbar/hooks/useSnaakcbar';
import { signIn } from 'next-auth/react';

export const useAuthModal = (
  toggleLoginModal: () => void,
  reset: () => void
) => {
  const [showRegisterFlow, setShowRegisterFlow] = useState(false);
  const [loaders, setLoaders] = useState({
    google: false,
    credentials: false,
  });
  const addSnackbar = useSnackbar();

  const toggleAuthFlow = () => {
    reset();
    setShowRegisterFlow((prev) => !prev);
  };

  const onSubmit = async (values: FieldValues) => {
    const { email, password } = values;

    try {
      setLoaders((prev) => ({
        ...prev,
        credentials: true,
      }));

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        addSnackbar({
          key: 'error',
          text: 'Невірний логін або пароль',
          variant: 'error',
        });
      } else {
        toggleLoginModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaders((prev) => ({
        ...prev,
        credentials: false,
      }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoaders((prev) => ({
        ...prev,
        google: true,
      }));
      await signIn('google');
    } catch (error) {
      console.log(error);
    } finally {
      setLoaders((prev) => ({
        ...prev,
        google: false,
      }));
    }
  };

  return {
    showRegisterFlow,
    loaders,
    disabled: loaders.credentials || loaders.google,
    onSubmit,
    toggleAuthFlow,
    handleGoogleSignIn,
  };
};
