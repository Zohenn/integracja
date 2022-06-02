import React, { useEffect } from 'react';
import './App.css';
import { ChartSection } from './ChartSection';
import { Box } from '@mui/material';
import { SignInSection } from './SignInSection';

function App() {
  return (
    <Box sx={{ padding: 3 }}>
      <SignInSection/>
      <ChartSection/>
    </Box>
  );
}

export default App;
