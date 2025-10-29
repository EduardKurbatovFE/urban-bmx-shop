export type User = {
  email: string;
  name: string | null;
  image: string | null;
  created_at: string;
  password: string;
  provider: string;
  id: string;
};

export type Breakpoint = 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs' | '3xs';
