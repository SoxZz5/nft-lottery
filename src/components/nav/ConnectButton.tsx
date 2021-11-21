import { ButtonUnstyledProps } from "@mui/core/ButtonUnstyled";
import { styled } from "@mui/system";
import React, { useEffect } from "react";
import { useButton } from "@mui/material";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "../../services/redux/user/user.interface";
import * as UserService from "../../services/redux/user/user.action";
//@ts-ignore
import { useEthers } from "@usedapp/core";

const CustomButtonRoot = styled("button")`
  background-color: #007fff;
  padding: 12px 16px;
  border-radius: 10px;
  color: #fff;
  font-weight: 500;
  font-family: Orbitron;
  text-transform: uppercase;
  font-size: 0.8rem
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 0 rgba(0, 127, 255, 0);
  border: none;

  &:hover {
    background-color: #0059b2;
  }

  &.active {
    background-color: #004386;
  }

  &.focusVisible {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1),
      0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;    box-shadow: 0 0 0 0 rgba(0, 127, 255, 0);
  }
`;

const CustomButton = React.forwardRef(function CustomButton(
  props: ButtonUnstyledProps,
  ref: React.ForwardedRef<any>
) {
  const { children } = props;
  const { active, disabled, focusVisible, getRootProps } = useButton({
    ...props,
    ref,
    component: CustomButtonRoot,
  });

  const classes = {
    active,
    disabled,
    focusVisible,
  };

  return (
    <CustomButtonRoot {...getRootProps()} className={clsx(classes)}>
      {children}
    </CustomButtonRoot>
  );
});

const ConnectButton: React.FunctionComponent = () => {
  const connected = useSelector((state: any) => state.user.connected);
  const stateAccount = useSelector((state: any) => state.user.account);
  const dispatch = useDispatch();
  const { activateBrowserWallet, account } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
    if (account) {
      dispatch(UserService.connect(account));
    }
    console.log(connected);
  }

  return (
    <div>
      {!connected ? (
        <CustomButton variant="outlined" onClick={handleConnectWallet}>
          Connect wallet
        </CustomButton>
      ) : (
        <CustomButton variant="outlined">{`${stateAccount.slice(
          0,
          7
        )}...`}</CustomButton>
      )}
    </div>
  );
};

export default ConnectButton;
