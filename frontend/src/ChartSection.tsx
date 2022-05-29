import { Box, CircularProgress, List, ListItemButton, ListItemText, ListSubheader, Stack } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Resource, Resources, useResourceStore } from './stores/resourceStore';
import { format } from 'date-fns';
import { useConflictStore } from './stores/conflictStore';
import { Chart } from './Chart';

interface ResourcesListProps {
  selectedResource: Resources;
  onSelectionChanged: (resource: Resources) => void;
}

function ResourcesList({ selectedResource, onSelectionChanged }: ResourcesListProps) {
  const resourceStore = useResourceStore();
  const { resources } = resourceStore;

  const dateFormat = 'MM.yyyy';
  const resourceDates = (resource: Resource) => `${format(resource.minDate, dateFormat)} – ${format(resource.maxDate, dateFormat)}`;

  return (
    <List subheader={
      <ListSubheader sx={{ textAlign: 'left' }}>Resources</ListSubheader>
    }>
      <Stack direction='row' spacing={1}>
        {(Object.entries(resources) as [Resources, Resource][]).map(([key, resource]) =>
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
  const [resource, setResource] = useState<Resources>('naturalgas');

  const init = async () => {
    await Promise.all([conflictStore.init(), resourceStore.init()]);
  }

  const initialized = useMemo(() => conflictStore.initialized && resourceStore.initialized, [conflictStore.initialized, resourceStore.initialized]);

  useEffect(() => {
    init();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      {
        initialized ? <Stack spacing={2}>
          <ResourcesList selectedResource={resource} onSelectionChanged={(resource) => setResource(resource)}/>
          <Chart selectedResource={resource}/>
        </Stack> : <CircularProgress/>
      }
    </Box>
  )
}
