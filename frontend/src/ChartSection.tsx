import { Box, CircularProgress, Grid, List, ListItemButton, ListItemText, ListSubheader, Stack } from '@mui/material';
import { Line } from 'react-chartjs-2';
import React, { useEffect, useMemo, useState } from 'react';
import { Resource, ResourceDataEntry, Resources, useResourceStore } from './stores/resourceStore';
import { format, isAfter, isBefore } from 'date-fns';
import axios from 'axios';
import { amber, blue, blueGrey, yellow } from '@mui/material/colors';
import { ChartOptions, LinearScale } from 'chart.js';
import { useConflictStore } from './stores/conflictStore';
import { AnnotationOptions, LineAnnotationOptions } from 'chartjs-plugin-annotation';

const resourceColors: Record<Resources, string> = {
  oil: 'black',
  naturalgas: blue[500],
  gold: amber[500],
  grain: yellow[500]
}

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  // scales: {
  //   y: {
  //     offset: true
  //   }
  // }
}

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
  const [data, setData] = useState<ResourceDataEntry[]>([]);

  const resourceInfo = resourceStore.resources[resource];

  const init = async () => {
    await Promise.all([conflictStore.init(), resourceStore.init()]);
    await fetchResourceData();
  }

  const fetchResourceData = async () => {
    const response = await axios.get<ResourceDataEntry[]>(`/api/rest/${resource}`);
    setData(response.data.map((entry) => ({ ...entry, date: new Date(entry.date) })));
  }

  const initialized = useMemo(() => conflictStore.initialized && resourceStore.initialized, [conflictStore.initialized, resourceStore.initialized]);

  const labels = useMemo(() => data.map((entry) => format(entry.date, 'MMM yyyy')), [data]);

  const values = useMemo(() => data.map((entry) => entry.price), [data]);

  const annotations = useMemo(() => conflictStore.conflicts
    .filter((conflict) => resourceInfo && isAfter(conflict.date, resourceInfo.minDate) && isBefore(conflict.date, resourceInfo.maxDate))
    .map((conflict) => ({
      type: 'line',
      borderColor: blueGrey[400],
      borderDash: [6, 6],
      borderDashOffset: 0,
      borderWidth: 2,
      label: {
        enabled: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        content: [conflict.name, format(conflict.date, 'd MMM yyyy')],
        position: (ctx) => {
          const maxYScaleValue = (ctx.chart.scales.y as LinearScale).max;
          const labels = ctx.chart.data.labels;
          const data = ctx.chart.data.datasets[0];
          const label = format(conflict.date, 'MMM yyyy');
          const index = labels?.indexOf(label);
          let yValue;
          if (index !== undefined && index > -1) {
            yValue = data.data[index];
          }
          yValue ??= 0;
          return yValue < maxYScaleValue / 2 ? 'start' : 'end';
        },
      },
      scaleID: 'x',
      value: format(conflict.date, 'MMM yyyy'),
      enter({ chart, element }) {
        (element.options as LineAnnotationOptions).label!.enabled = true;
        chart.draw();
      },
      leave({ chart, element }) {
        (element.options as LineAnnotationOptions).label!.enabled = false;
        chart.draw();
      }
    }) as AnnotationOptions),
    [resourceInfo, conflictStore.conflicts]
  );

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    fetchResourceData();
  }, [resource])

  return (
    <Box sx={{ padding: 2 }}>
      {
        initialized ? <Stack spacing={2}>
          <ResourcesList selectedResource={resource} onSelectionChanged={(resource) => setResource(resource)}/>
          <Box sx={{ minHeight: '300px' }}>
            <Line data={{
              labels,
              datasets: [
                {
                  label: resourceInfo!.name,
                  data: values,
                  pointRadius: 0,
                  borderColor: resourceColors[resource],
                  backgroundColor: resourceColors[resource],
                }
              ]
            }} options={{ ...chartOptions, plugins: { annotation: { annotations } } } as ChartOptions<"line">}/>
          </Box>
        </Stack> : <CircularProgress/>
      }
    </Box>
  )
}
