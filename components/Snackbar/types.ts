import React from 'react';

export type SnackbarType = {
  key: string;
  text: React.ReactNode;
  variant: 'success' | 'error' | 'warning' | 'info';
};

export type TSnackbarProps = Omit<SnackbarType, 'key'> & {
  handleClose: () => void;
  className?: string;
};
