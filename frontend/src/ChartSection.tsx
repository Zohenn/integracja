import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Resource, Resources, useResourceStore } from './stores/resourceStore';
import { format } from 'date-fns';
import { useConflictStore } from './stores/conflictStore';
import { Chart } from './Chart';
import { UserSection } from './UserSection';

interface ResourcesListProps {
  selectedResource: Resources;
  onSelectionChanged: (resource: Resources) => void;
}

function ResourcesList({ selectedResource, onSelectionChanged }: ResourcesListProps) {
  const resourceStore = useResourceStore();
  const { resources } = resourceStore;

  const sortedResources = Object.entries(resources)
  .sort(([_, a], [__, b]) => a.name.localeCompare(b.name)) as [Resources, Resource][]

  const dateFormat = 'MM.yyyy';
  const resourceDates = (resource: Resource) => `${format(resource.minDate, dateFormat)} – ${format(resource.maxDate, dateFormat)}`;

  return (
    <List subheader={
      <Typography variant='h6' component='h6' sx={{ marginBottom: 1 }}>Resources</Typography>
    }>
      <Stack direction='row' spacing={1}>
        {sortedResources.map(([key, resource]) =>
          <ListItemButton key={key}
                          selected={key === selectedResource}
                          sx={{ borderRadius: 3 }}
                          onClick={() => onSelectionChanged(key)}>
            <ListItemText primary={resource.name} secondary={resourceDates(resource)}/>
          </ListItemButton>
        )}
      </Stack>
    </List>
  )
}

export function ChartSection() {
  const conflictStore = useConflictStore();
  const resourceStore = useResourceStore();
  const [resource, setResource] = useState<Resources>('gold');

  const init = async () => {
    await Promise.all([conflictStore.init(), resourceStore.init()]);
  }

  const initialized = useMemo(() => conflictStore.initialized && resourceStore.initialized, [conflictStore.initialized, resourceStore.initialized]);

  useEffect(() => {
    init();
  }, [initialized]);

  return (
    <Paper sx={{ padding: 3, borderRadius: 3 }} elevation={6}>
      {
        initialized ?
          <Stack spacing={2}>
            <UserSection/>
            <ResourcesList selectedResource={resource} onSelectionChanged={(resource) => setResource(resource)}/>
            <Chart selectedResource={resource}/>
          </Stack> : <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress/>
          </Box>
      }
    </Paper>
  )
}
