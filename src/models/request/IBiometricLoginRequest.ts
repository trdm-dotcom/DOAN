import { IDataRequest } from './IDataRequest.model';

export interface IBiometricLoginRequest extends IDataRequest {
  signatureValue: string;
  username: string;
  password?: string;
  grant_type: string;
  client_secret: string;
}
