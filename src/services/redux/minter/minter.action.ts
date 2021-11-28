import { MinterAction } from "./minter.interface";

export const setState = (state: number) => async (dispatch: any) => {
  dispatch({
    type: MinterAction.SET_STATE,
    payload: state,
  });
};
