export default interface rawDecodedToken {
  email: string;
  name: string;
  email_verified: string;
  user_role: 'admin_user' | 'client_user'; // authorization role
}
