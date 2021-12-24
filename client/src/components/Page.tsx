import React from 'react';
import {Container, Row} from 'react-bootstrap';
import { push as Menu } from 'react-burger-menu';
import '../styles/burger-menu.scss';
import * as styles from '../styles/page.module.scss';
import classNames from 'classnames';
import {uniqueId} from 'lodash';

interface PageProps {
  enabled: boolean;
  startOfPage: JSX.Element;
  endOfPage?: JSX.Element;
}

export const Page: React.FC<PageProps> = (props) => {
  const wrapperId = uniqueId();
  const pageId = uniqueId();

  return (
    <div id={wrapperId} className={classNames(styles.pageWrapper, props.enabled ? styles.enabled : '')}>
      {/*<Menu pageWrapId={pageId} outerContainerId={wrapperId} className={styles.menu}>*/}
      {/*  <a>How to?</a>*/}
      {/*  <a>Impressum</a>*/}
      {/*  <a>Datenschutz</a>*/}
      {/*</Menu>*/}
      <Container id={pageId} className={styles.page}>
        <Row>{ props.startOfPage }</Row>
        <Row className={styles.gap} />
        { props.endOfPage ? <Row className={styles.bottom}>{ props.endOfPage }</Row> : <></> }
      </Container>
    </div>
  );
};
