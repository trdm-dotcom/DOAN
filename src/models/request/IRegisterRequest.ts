import {IDataRequest} from './IDataRequest.model';

export interface IRegisterRequest extends IDataRequest {
  username: string;
  password: string;
  otpKey: string;
  name: string;
  mail: string;
}
