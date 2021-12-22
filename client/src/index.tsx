import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'regenerator-runtime/runtime';
import 'bootstrap';
import './styles/index.sass';

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
