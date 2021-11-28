export interface UserState {
  connected: boolean;
  account: string;
  chain: string;
}

export enum UserAction {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  SET_ACCOUNT = "SET_ACCOUNT",
}
