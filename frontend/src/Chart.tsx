import {
  BaseResourceDataEntry,
  ResourceDataEntry,
  Resources,
  ResourceSubsetDataEntry,
  useResourceStore
} from './stores/resourceStore';
import { useConflictStore } from './stores/conflictStore';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { format, isAfter, isBefore } from 'date-fns';
import { amber, blue, blueGrey, yellow } from '@mui/material/colors';
import { ChartDataset, ChartOptions, LinearScale } from 'chart.js';
import { AnnotationOptions, LineAnnotationOptions } from 'chartjs-plugin-annotation';
import { Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';

const resourceColors: Record<Resources, string | Record<string, string>> = {
  oil: '#000000',
  naturalgas: blue[500],
  gold: amber[500],
  grain: {
    wheat: '#F5DEB3',
    corn: '#EDD84D',
    rice: '#DCC39F'
  }
}

const baseChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
}

interface ChartProps {
  selectedResource: Resources;
}

export function Chart({ selectedResource }: ChartProps) {
  const conflictStore = useConflictStore();
  const resourceStore = useResourceStore();
  const [data, setData] = useState<BaseResourceDataEntry[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const resourceInfo = resourceStore.resources[selectedResource]!;

  const fetchResourceData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get<BaseResourceDataEntry[]>(`/api/rest/${selectedResource}`);
      setData(response.data.map((entry) => ({ ...entry, date: new Date(entry.date) })));
    } finally {
      setIsFetching(false);
    }
  }

  const labels = useMemo(() => data.map((entry) => format(entry.date, 'MMM yyyy')), [data]);

  const datasets = useMemo<ChartDataset<"line">[]>(() => {
    if (!resourceInfo.subsets) {
      return [
        {
          label: resourceInfo!.name,
          data: data.map((entry) => (entry as ResourceDataEntry).price),
          pointRadius: 0,
          borderColor: resourceColors[selectedResource],
          backgroundColor: resourceColors[selectedResource] + '80',
        }
      ]
    }

    return Object.entries(resourceInfo.subsets).map(([key, title]) => ({
      label: title,
      data: data.map((entry) => (entry as ResourceSubsetDataEntry)[key]),
      pointRadius: 0,
      borderColor: (resourceColors[selectedResource] as Record<string, string>)[key],
      backgroundColor: (resourceColors[selectedResource] as Record<string, string>)[key] + '80',
    }))
  }, [data])

  const annotations = useMemo(() => conflictStore.conflicts
    .filter((conflict) => isAfter(conflict.date, resourceInfo.minDate) && isBefore(conflict.date, resourceInfo.maxDate))
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
    fetchResourceData();
  }, [selectedResource])

  return (
    <>
      <Box sx={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isFetching ?
          <CircularProgress/> :
          <Line
            data={{
              labels,
              datasets,
            }}
            options={{
              ...baseChartOptions,
              scales: {
                y: {
                  title: {
                    display: true,
                    text: resourceInfo.unit
                  }
                }
              },
              plugins: {
                annotation: { annotations },
                tooltip: { callbacks: { label: (item) => `${item.formattedValue} ${resourceInfo.unit}` } }
              }
            } as ChartOptions<"line">}/>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <Box sx={{
          height: '2px',
          width: '18px',
          marginRight: 1,
          '--line-color': blueGrey[400],
          background: 'linear-gradient(to right, var(--line-color), var(--line-color) 33%, white 33%, white 66%, var(--line-color) 66%);'
        }}></Box>
        <span style={{ fontSize: '.875rem' }}>Military conflicts</span>
      </Box>
    </>
  )
}
