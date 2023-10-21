export default interface IChangePasswordRequest {
  username?: string;
  newPassword: string;
  oldPassword?: string;
  otpKey: string;
  hash: string;
}
