import { PayloadAction } from "@reduxjs/toolkit";
import { UserAction, UserState } from "./user.interface";

const initialState: UserState = {
  connected: false,
  account: "",
};

const userReducer = (
  state = initialState,
  action: PayloadAction<any>
): UserState => {
  switch (action.type) {
    case UserAction.CONNECT:
      return { ...state, connected: true };
    case UserAction.DISCONNECT:
      return { ...state, connected: false };
    case UserAction.SET_ACCOUNT:
      console.log({ ...state, account: action.payload });
      return { ...state, account: action.payload };
    default:
      return state;
  }
};

export default userReducer;
