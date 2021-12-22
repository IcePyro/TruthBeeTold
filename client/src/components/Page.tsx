import React, {ReactNode} from 'react';
import {Container} from 'react-bootstrap';
import { push as Menu } from 'react-burger-menu';
import '../styles/burger-menu.scss';
import * as styles from '../styles/page.module.scss';

interface PageProps {
}

export const Page: React.FC<PageProps> = (props) => (
  <div id="outer-container">
    <Menu pageWrapId="page-wrap" outerContainerId="outer-container" className={styles.menu}>
      <a>How to?</a>
      <a>Impressum</a>
      <a>Datenschutz</a>
    </Menu>
    <Container id="page-wrap">
      { props.children }
    </Container>
  </div>
);
