import React from 'react';
import * as styles from '../styles/titled-hgap.module.scss';

export const TitledHGap: React.FC = ({ children }) => (
  <div className={styles.wrapper}>
    <hr />
    <span>{ children }</span>
    <hr />
  </div>
);
