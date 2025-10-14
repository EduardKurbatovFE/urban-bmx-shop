'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSnackbar from '@/components/Snackbar/hooks/useSnaakcbar';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const addSnackbar = useSnackbar();

  useEffect(() => {
    const email = params.get('email');

    if (!email) {
      addSnackbar({
        key: 'invalid-url',
        text: 'Неправильне або прострочене посилання.',
        variant: 'error',
      });
      return;
    }

    addSnackbar({
      key: 'success',
      text: `✅ Email ${email} підтверджено. Тепер ви можете увійти.`,
      variant: 'success',
    });

    // Наприклад, автоматично редіректити на сторінку входу
    router.push('/');
  }, [params, addSnackbar, router]);

  return (
    <p className="text-center mt-10">Підтвердження облікового запису...</p>
  );
}
