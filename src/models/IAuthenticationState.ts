export default interface AuthenticationState {
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  role: 'admin_user' | 'client_user' | '';
  error: string | null;
}
