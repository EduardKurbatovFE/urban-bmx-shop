'use client';

import SnackbarProvider from '@/components/Snackbar/context/SnackbarProvider';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SnackbarProvider>{children}</SnackbarProvider>
    </SessionProvider>
  );
}
