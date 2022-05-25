import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
import { Line } from 'react-chartjs-2';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Button variant='contained'>Przycisk</Button>
        <div style={{ maxHeight: "200px" }}>
          <Line data={{
            labels: ['Mar 2022', 'Apr 2022', 'May 2022'],
            datasets: [
              {
                label: '',
                data: [1, 5, 4]
              }
            ]
          }}/>
        </div>
        <img src={logo} className='App-logo' alt='logo'/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
