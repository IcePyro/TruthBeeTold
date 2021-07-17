import '../styles/clear-session.sass';
import React from 'react';
import Cookies from 'js-cookie';

export const ClearSession: React.FC = () => {
  const clearSession = () => {
    Cookies.remove('token');
    location.reload();
  };

  return (
    <button id='clear-session' onClick={clearSession}>Clear Session</button>
  );
};
