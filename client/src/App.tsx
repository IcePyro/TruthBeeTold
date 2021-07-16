import './styles/app.sass';
import React from 'react';
import Home from './pages/Home';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);

  }


  render(): React.ReactNode {
    return (
        <Home/>
    );
  }
}
