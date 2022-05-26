import React, { useEffect } from 'react';
import './App.css';
import { Button, Grid, List, ListItemButton, ListItemText, ListSubheader, Stack } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Resource, useResourceStore } from './stores/resourceStore';
import { format } from 'date-fns';

function ResourcesList() {
  const resourceStore = useResourceStore();
  const { resources } = resourceStore;

  const dateFormat = 'MM.yyyy';
  const resourceDates = (resource: Resource) => `${format(resource.minDate, dateFormat)} – ${format(resource.maxDate, dateFormat)}`;

  return (
    <List subheader={
      <ListSubheader sx={{ textAlign: 'left' }}>Surowce</ListSubheader>
    }>
      <Stack spacing={1}>
        {Object.entries(resources).map(([key, resource]) =>
          <ListItemButton key={key} selected={true} sx={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
            <ListItemText primary={resource.name} secondary={resourceDates(resource)}/>
          </ListItemButton>
        )}
      </Stack>
    </List>
  )
}

function App() {
  const { init, initialized } = useResourceStore(state => ({
    init: state.init,
    initialized: state.initialized,
  }));

  useEffect(() => {
    init();
  }, []);

  return (
    <div className='App'>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <div>
            <Line data={{
              labels: ['Mar 2022', 'Apr 2022', 'May 2022'],
              datasets: [
                {
                  label: '',
                  data: [1, 5, 4]
                }
              ]
            }} options={{ responsive: true, maintainAspectRatio: false }}/>
          </div>
        </Grid>
        <Grid item xs={3}>
          {initialized && <ResourcesList/>}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
