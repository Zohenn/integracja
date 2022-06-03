import React, { useEffect } from 'react';
import './App.css';
import { ChartSection } from './ChartSection';
import { Box } from '@mui/material';
import { SignInSection } from './SignInSection';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isSignedIn } = useAuthStore();
  return (
    <Box sx={{ padding: 3 }}>
      {/*<ChartSection/>*/}
      {/*<SignInSection/>*/}
      {!isSignedIn() ? <SignInSection/> : <ChartSection/>}
    </Box>
  );
}

export default App;
