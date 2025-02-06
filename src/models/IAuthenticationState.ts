export default interface AuthenticationState {
  email: string;
  firstName: string;
  isEmailVerified: boolean;
  role: 'admin_user' | 'client_user' | '';
  error: string;
}
