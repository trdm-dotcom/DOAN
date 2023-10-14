import {ILoginRequest} from '../../models/request/ILoginRequest.model';
import {ILoginResponse} from '../../models/response/ILoginResponse';
import {IRegisterRequest} from '../../models/request/IRegisterRequest';
import {ICheckExistRequest} from '../../models/request/ICheckExistRequest';
import {ICheckExistResponse} from '../../models/response/ICheckExistResponse';
import {IUserInfoResponse} from '../../models/response/IUserInfoResponse';
import {apiPost, apiPut} from '../../utils/Api';
import {IBiometricLoginRequest} from '../../models/request/IBiometricLoginRequest';
import {AppThunk} from '../redux/store';
import {
  authenticated,
  getAccountInfo,
  logout,
} from '../redux/authentication.reducer';
import {getUserInfo} from './user';
import {removeToken, saveToken} from '../../utils/Storage';
import {IUpdateUserInfoRequest} from '../../models/request/IUpdateUserInfoRequest';

type AuthenticationType = {
  type: 'password' | 'biometric';
  data: ILoginRequest | IBiometricLoginRequest;
};

export const authenticate = async (
  body: AuthenticationType,
): Promise<ILoginResponse> => {
  switch (body.type) {
    case 'password':
      return await apiPost<ILoginResponse>(
        '/login',
        {data: body.data},
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      );
    case 'biometric':
      return await apiPost<ILoginResponse>(
        '/biometric',
        {data: body.data},
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      );
    default:
      return await Promise.reject('Invalid type');
  }
};

export const registerNewAccount = async (
  body: IRegisterRequest,
): Promise<any> =>
  await apiPost<any>(
    '/register',
    {data: body},
    {
      'Content-Type': 'application/json',
    },
  );

export const updateUserInfo = async (
  body: IUpdateUserInfoRequest,
): Promise<any> => {
  return await apiPut<any>(
    '/user/info',
    {data: body},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const getAccount = (): AppThunk => async dispatch => {
  const response: IUserInfoResponse[] = await getUserInfo();
  dispatch(getAccountInfo(response[0]));
};

export const getSession = (): AppThunk => async dispatch => {
  dispatch(getAccount());
  dispatch(authenticated());
};

export const checkExist = async (
  body: ICheckExistRequest,
): Promise<ICheckExistResponse> =>
  apiPost<ICheckExistResponse>('/user/checkExist', {data: body});

export const register = async (body: IRegisterRequest) => {
  await registerNewAccount(body);
  await password({
    username: body.username,
    password: body.password,
    hash: body.hash,
    grant_type: 'password',
    client_secret: 'secret',
  });
};

export const password = async (body: ILoginRequest) => {
  const response = await authenticate({type: 'password', data: body});
  await saveToken({
    token: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      accExpiredTime: response.accExpiredTime,
      refExpiredTime: response.refExpiredTime,
    },
    type: 'password',
    data: body,
  });
};

export const biometric = async (body: IBiometricLoginRequest) => {
  const response: ILoginResponse = await authenticate({
    type: 'biometric',
    data: body,
  });
  await saveToken({
    token: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      accExpiredTime: response.accExpiredTime,
      refExpiredTime: response.refExpiredTime,
    },
    type: 'biometric',
    data: body,
  });
};

export const signOut = (): AppThunk => async dispatch => {
  await apiPost<any>(
    '/revokeToken',
    {data: {refresh_token: ''}},
    {
      'Content-Type': 'application/json',
    },
  );
  await removeToken();
  dispatch(logout());
};
