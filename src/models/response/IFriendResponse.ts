import {IUserInfoResponse} from './IUserInfoResponse';

export default interface IFriendResponse extends IUserInfoResponse {
  friendStatus: string;
  friendId: number;
  isAccept: boolean;
}
