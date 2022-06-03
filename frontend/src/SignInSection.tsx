import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormEvent, useState } from 'react';
import { useAuthStore } from './stores/authStore';

export function SignInSection() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const authStore = useAuthStore();

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsSigningIn(true);
      setError("");
      await authStore.signIn(username, password);
    } catch(e) {
      if(typeof e === 'string'){
        setError(e);
      } else {
        setError((e as Error).message);
      }
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <Container maxWidth='sm'>
      <Paper sx={{ padding: 3, borderRadius: 3 }} elevation={6}>
        <form onSubmit={signIn}>
          <Stack spacing={2}>
            <Typography variant='h6' component='h6'>Sign in</Typography>
            <TextField label='Username'
                       size='small'
                       required
                       value={username}
                       onChange={(event) => setUsername(event.target.value)}></TextField>
            <TextField label='Password'
                       type='password'
                       size='small'
                       required
                       value={password}
                       onChange={(event) => setPassword(event.target.value)}></TextField>
            <Stack direction='row' justifyContent='flex-end'>
              <LoadingButton loading={isSigningIn} variant='contained' type='submit'>Sign in</LoadingButton>
            </Stack>
            { error ? <Typography variant='body2'>{error}</Typography> : null }
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}
