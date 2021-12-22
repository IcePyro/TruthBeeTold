import React from 'react';
import classNames from 'classnames';

type MaterialIconProps = {
  children: string;
} & React.HTMLProps<HTMLSpanElement>;

export const MaterialIcon: React.FC<MaterialIconProps> = (props) => (
  <span {...props} className={classNames(props.className, 'material-icons')}>{ props.children }</span>
);
