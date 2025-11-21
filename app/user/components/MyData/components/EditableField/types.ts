import { User } from '@/types/common';

export interface EditableFieldProps {
  id: string;
  asset: {
    label: string;
    value: string | null;
    fieldName?: UserEditableField;
    readOnly?: boolean;
  };
}

export type UserEditableField = 'name' | 'lastName' | 'city' | 'phoneNumber';
