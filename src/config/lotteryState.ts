const state: { [key: string]: string } = {
  WaitingForLINK: "Coming soon",
  WaitingForParticipationPeriod: "Coming soon",
  OngoingParticipationPeriod: "Mint period",
  OngoingPreparationPeriod: "Boost Your Mint",
  WaitingForNextEvent: "Waiting for next event",
  WaitingForFundsRelease: "Waiting for funds release",
  Complete: "Winner is Humanity !",
};

export default Object.keys(state).map((val: string) => {
  return state[val];
});
