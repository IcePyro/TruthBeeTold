import {Button, ButtonProps} from 'react-bootstrap';
import React from 'react';

type CheckboxButton = ButtonProps

export const CheckboxButton: React.FC<CheckboxButton> = (props) => {
  return <Button {...props}>
    { props.children }
  </Button>;
};
