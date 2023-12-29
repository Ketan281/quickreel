// src/App.js
import React from 'react';
import VideoPlayer from './components/Videoplayer';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Video Player with Face Detection</h1>
      <VideoPlayer />
    </div>
  );
}

export default App;
