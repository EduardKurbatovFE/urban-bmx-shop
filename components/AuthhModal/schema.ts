import * as Yup from 'yup';

export const authSchema = Yup.object().shape({
  email: Yup.string().email('Невірний email'),
  password: Yup.string().matches(/^(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message:
      'Пароль має бути мінімум 6 символів, містити заголовну літеру та число',
  }),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Паролі мають співпадати'
  ),
});
