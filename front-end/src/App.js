
import React from 'react';
import CreateShortUrl from './components/CreateShortUrl';
import UrlStats from './components/UrlStats';
import './styles/main.css';

function App() {
  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <CreateShortUrl />
      <UrlStats />
    </div>
  );
}

export default App;
