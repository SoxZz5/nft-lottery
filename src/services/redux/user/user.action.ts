import { UserAction } from "./user.interface";

export const connect =
  (account: string, chain: any) => async (dispatch: any) => {
    dispatch({
      type: UserAction.CONNECT,
    });
    dispatch({
      type: UserAction.SET_ACCOUNT,
      payload: account,
    });
    dispatch({
      type: UserAction.SET_CHAIN,
      payload: chain,
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
