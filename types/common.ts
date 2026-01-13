type NullableKeys =
  | 'name'
  | 'lastName'
  | 'image'
  | 'password'
  | 'city'
  | 'phoneNumber'
  | 'avatar_url';

export type User = {
  email: string;
  created_at: string;
  provider: string;
  id: string;
} & {
  [K in NullableKeys]: string | null;
};
