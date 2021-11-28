import { PayloadAction } from "@reduxjs/toolkit";
import { MinterAction, MinterState } from "./minter.interface";

const initialState: MinterState = {
  state: 0,
};

const minterReducer = (
  state = initialState,
  action: PayloadAction<any>
): MinterState => {
  switch (action.type) {
    case MinterAction.SET_STATE:
      return { ...state, state: action.payload };
    default:
      return state;
  }
};

export default minterReducer;
