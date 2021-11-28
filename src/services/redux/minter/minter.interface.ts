export interface MinterState {
  state: number;
  contract: any;
}

export enum MinterAction {
  SET_STATE = "SET_STATE",
  SET_CONTRACT = "SET_CONTRACT",
}
