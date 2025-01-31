import AuthResponse from 'src/models/IAuthResponse';

export const loginResponseAdapter = (data: AuthResponse) => {
  return { ...data };
};
