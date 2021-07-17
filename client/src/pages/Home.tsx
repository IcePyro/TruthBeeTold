import React from 'react';
import '../styles/home.sass';
import User from '../session/User';


export default class Home extends React.Component {

  public constructor(props: any) {
    super(props);
    User.instance.socket;
  }

  render(): React.ReactNode {
    return (<></>);
  }
}
