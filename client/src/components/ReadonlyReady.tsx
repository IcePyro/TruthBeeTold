import React from 'react';
import '../styles/readonly-ready.sass';

export interface ReadonlyReadyProps {
  ready: boolean;
}

export const ReadonlyReady: React.FC<ReadonlyReadyProps> = (props: ReadonlyReadyProps) => (
  <div className={ 'other-ready' + (props.ready ? ' ready' : '')}/>
);
