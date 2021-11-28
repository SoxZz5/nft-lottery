import { PayloadAction } from "@reduxjs/toolkit";
import { MinterAction, MinterState } from "./minter.interface";

const initialState: MinterState = {
  state: 0,
  contract: {},
};

const minterReducer = (
  state = initialState,
  action: PayloadAction<any>
): MinterState => {
  switch (action.type) {
    case MinterAction.SET_CONTRACT:
      return { ...state, contract: action.payload };
    case MinterAction.SET_STATE:
      return { ...state, state: action.payload };
    default:
      return state;
  }
};

export default minterReducer;
