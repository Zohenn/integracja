import { useAuthStore } from './stores/authStore';
import { Button, Stack, SvgIcon, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const capitalizeFirst = (s: string) => s[0].toUpperCase() + s.substring(1);

export function UserSection() {
  const { user, signOut } = useAuthStore();

  return (
    <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={3}>
      <Stack>
        <Typography variant='body1' component='div'>{user!.username}</Typography>
        <Typography variant='caption'
                    component='div'
                    sx={{ color: grey[600] }}>Role: {capitalizeFirst(user!.role)}</Typography>
      </Stack>
      <Button onClick={signOut}>Sign out</Button>
    </Stack>
  )
}
