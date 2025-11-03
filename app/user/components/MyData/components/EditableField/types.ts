import { User } from '@/types/common';

export interface EditableFieldProps {
  id: string;
  asset: {
    label: string;
    value: string | number | null;
    readonly?: boolean;
  };
}

export type UserEditableField = Omit<
  User,
  'password' | 'created_at' | 'provider' | 'id' | 'image' | 'email'
>;
