import {IDataRequest} from './IDataRequest.model';

export interface ILoginRequest extends IDataRequest {
  username?: string;
  password?: string;
  grant_type?: string;
  client_secret?: string;
}
