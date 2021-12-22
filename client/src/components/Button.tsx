import React from 'react';
import {Button, ButtonProps} from 'react-bootstrap';

type BigButtonProps = ButtonProps

export const BigButton: React.FC<BigButtonProps> = (props) => {
  return <Button {...props}>
    { props.children }
  </Button>;
};
