export default interface IChangePasswordRequest {
  username: string;
  newPassword: string;
  otpKey: string;
  hash: string;
}
