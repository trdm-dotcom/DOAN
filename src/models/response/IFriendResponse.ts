import {IUserInfoResponse} from './IUserInfoResponse';

export default interface IFriendResponse extends IUserInfoResponse {
  statusFriend: string;
  friendId: number;
}
