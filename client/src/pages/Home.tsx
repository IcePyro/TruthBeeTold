import React from 'react';
import '../styles/home.sass';
import Auth from '../session/Auth';


export default class Home extends React.Component {

  public constructor(props: any) {
    super(props);

    Auth.socket.on('requestid', () => {
      const id = Home.requestId();
      if (id !== null) {
        Auth.socket.emit('id', id);
      }
    });
  }

  private static requestId(): number | null {
    const id = Number(prompt('Please enter your id'));
    return !Number.isNaN(id) ? id : null;
  }

  render(): React.ReactNode {
    return (<></>);
  }
}
