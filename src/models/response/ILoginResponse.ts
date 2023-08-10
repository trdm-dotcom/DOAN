export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  userInfo?: IUserData;
  accExpiredTime?: number;
  refExpiredTime?: number;
}

export interface IUserData {
  id?: number;
  username?: string;
  status?: string;
  name?: string;
}
