import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "@/services/redux/user/user.action";
//@ts-ignore
import { useEthers } from "@usedapp/core";
import CustomButton from "@/components/utils/CustomButton";

const ConnectButton: React.FunctionComponent = () => {
  const connected = useSelector((state: any) => state.user.connected);
  const stateAccount = useSelector((state: any) => state.user.account);
  const dispatch = useDispatch();
  const { activateBrowserWallet, account } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  useEffect(() => {
    if (account) {
      dispatch(UserService.connect(account));
    } else {
      dispatch(UserService.disconnect());
    }
  }, [account]);

  return !connected ? (
    <CustomButton variant="outlined" onClick={handleConnectWallet}>
      Connect wallet
    </CustomButton>
  ) : (
    <CustomButton variant="outlined">{`${stateAccount.slice(
      0,
      11
    )}...`}</CustomButton>
  );
};

export default ConnectButton;
