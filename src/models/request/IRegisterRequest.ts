import {IDataRequest} from './IDataRequest.model';

export interface IRegisterRequest extends IDataRequest {
  phoneNumber: string;
  email: string;
  password: string;
  otpKey: string;
  hash: string;
  name: string;
}
