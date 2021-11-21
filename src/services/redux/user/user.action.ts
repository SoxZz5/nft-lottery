import { UserAction } from "./user.interface";

export const connect = (account: string) => async (dispatch: any) => {
  dispatch({
    type: UserAction.CONNECT,
  });
  dispatch({
    type: UserAction.SET_ACCOUNT,
    payload: account,
  });
};

export const disconnect = () => async (dispatch: any) => {
  dispatch({
    type: UserAction.DISCONNECT,
  });
  dispatch({
    type: UserAction.SET_ACCOUNT,
    payload: "",
  });
};
