export type LoginState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialLoginState: LoginState = {
  ok: false,
  message: '',
};