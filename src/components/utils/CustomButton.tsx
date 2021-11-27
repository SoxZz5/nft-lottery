import { Button, useButton } from "@mui/material";
import React from "react";
import clsx from "clsx";
import { ButtonUnstyledProps } from "@mui/core/ButtonUnstyled";
import { styled } from "@mui/system";

const CustomButtonRoot = styled(Button)`
  padding: 8px 12px;
  color: #fff;
  font-family: Orbitron;
  text-shadow: 0 2px 24px #f0f;
  font-size: 16px;
  font-weight: bold;
  transition: all 200ms ease;
  cursor: pointer;
  border: none;
  margin-right: 4rem;
  border-radius: 5px;
  box-shadow: 0 0 24px 0 #f0f;
  border: solid 1px #f0f;
  background-image: linear-gradient(to bottom, #f0f, #36013f);
  text-transform: capitalize;

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
    cursor: not-allowed;
    box-shadow: 0 0 0 0 rgba(0, 127, 255, 0);
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

export default CustomButton;
