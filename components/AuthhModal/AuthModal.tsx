'use client';

import React, { useState } from 'react';
import CloseIcon from '@/icons/CloseIcon';
import { signIn } from 'next-auth/react';
import GoogleIcon from '@/icons/GoogleIcon';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authSchema } from './schema';
import useSnackbar from '../Snackbar/hooks/useSnaakcbar';

interface AuthModalProps {
  toggleLoginModal: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ toggleLoginModal }) => {
  const [showRegisterFlow, setShowRegisterFlow] = useState(false);
  const addSnackbar = useSnackbar();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authSchema),
  });

  const toggleAuthFlow = () => {
    clearErrors();
    setShowRegisterFlow((prev) => !prev);
  };

  const onSubmit = async (values: FieldValues) => {
    const { email, password } = values;

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
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" />
      <div className="absolute top-3/12 left-5/12 z-50">
        <div className="bg-white p-6 z-50 w-96 rounded-md">
          <div className="flex flex-col gap-6">
            <div className="flex w-full justify-end">
              <span className="cursor-pointer" onClick={toggleLoginModal}>
                <CloseIcon color="#000" />
              </span>
            </div>

            <h2 className="text-stone-900 font-bold text-2xl">
              {showRegisterFlow ? 'Реєстрація' : 'Вхід'}
            </h2>

            <p className="text-sm text-stone-700">
              {showRegisterFlow
                ? 'Зареєстровані користувачі отримують більше! Створіть свій акаунт.'
                : 'Ласкаво просимо! Авторизуйтеся для зручнішого користування магазином та застосування персональних знижок.'}
            </p>

            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                {...register('email')}
                placeholder="Email"
                className="p-2 rounded text-black border-stone-400 border outline-0 w-full"
                required
              />
              {errors.email?.message && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}

              <input
                {...register('password')}
                type="password"
                placeholder="Пароль"
                className="p-2 rounded text-black border-stone-400 border outline-0 w-full"
                required
              />

              {errors.password?.message && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}

              {showRegisterFlow && (
                <>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Підтвердіть пароль"
                    className="p-2 rounded text-black border-stone-400 border outline-0 w-full"
                    required
                  />
                  {errors.confirmPassword?.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </>
              )}

              <div className="flex flex-col gap-3 mt-3">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-stone-400 rounded text-sm hover:opacity-90 cursor-pointer h-9"
                >
                  <p className="text-white">
                    {showRegisterFlow ? 'Зареєструватись' : 'Увійти'}
                  </p>
                </button>

                <button
                  onClick={() => signIn('google')}
                  className="flex items-center justify-center gap-2 border border-stone-400 rounded text-sm hover:opacity-90 cursor-pointer h-9"
                >
                  <p className="text-stone-700">{`${showRegisterFlow ? 'Зареєструватись' : 'Увійти'} з Google`}</p>
                  <GoogleIcon width={24} height={24} />
                </button>
              </div>
            </form>

            <div className="flex justify-center">
              <p className="text-xs">
                {showRegisterFlow ? 'Вже є аккаунт ?' : 'Ще немає аккаунту ?'}
                <span
                  onClick={toggleAuthFlow}
                  className="text-blue-400 font-bold cursor-pointer hover:opacity-90 ml-1.5"
                >
                  {showRegisterFlow ? 'Увійти' : 'Зареєструватись'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
