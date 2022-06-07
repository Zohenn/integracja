import {
  BaseResourceDataEntry, Resource,
  ResourceDataEntry,
  Resources,
  ResourceSubsetDataEntry,
  useResourceStore
} from './stores/resourceStore';
import { useConflictStore } from './stores/conflictStore';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format, formatISO,
  getTime, getYear,
  isAfter,
  isBefore
} from 'date-fns';
import { amber, blue, blueGrey, yellow } from '@mui/material/colors';
import { ChartDataset, ChartOptions, LinearScale } from 'chart.js';
import { AnnotationOptions, LineAnnotationOptions } from 'chartjs-plugin-annotation';
import {
  Box, Button,
  CircularProgress, Divider,
  FormControl, FormControlLabel,
  FormLabel,
  Grid, InputLabel,
  ListSubheader, MenuItem, Radio, RadioGroup, Select,
  Slider,
  Stack,
  Typography
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { isDateInRange } from './utils';
import { FileExportSection, FileImportExportSection, FileImportSection } from './FileImportExportSection';

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

const baseAnnotationOptions: AnnotationOptions<"line"> = {
  type: 'line',
  borderColor: blueGrey[400],
  borderDash: [6, 6],
  borderDashOffset: 0,
  borderWidth: 2,
  scaleID: 'x',
  enter({ chart, element }) {
    (element.options as LineAnnotationOptions).label!.enabled = true;
    chart.draw();
  },
  leave({ chart, element }) {
    (element.options as LineAnnotationOptions).label!.enabled = false;
    chart.draw();
  }
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

  const [dateRange, setDateRange] = useState<[number, number]>([getTime(resourceInfo.minDate), getTime(resourceInfo.maxDate)]);

  const fetchResourceData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get<BaseResourceDataEntry[]>(`/api/rest/${selectedResource}`);
      setData(response.data.map((entry) => ({ ...entry, date: new Date(entry.date) })));
      setDateRange([getTime(resourceInfo.minDate), getTime(resourceInfo.maxDate)]);
    } finally {
      setIsFetching(false);
    }
  }

  const exportData = async (dataSource: string, fileType: string) => {
    let url = `http://localhost:8080/api/rest/${selectedResource}`;
    const query = new URLSearchParams();
    query.append('format', fileType);
    if (dataSource === 'date-range') {
      url += '/date-range'
      query.append('startDate', formatISO(dateRange[0]));
      query.append('endDate', formatISO(dateRange[1]));
    }
    window.location.href = `${url}?${query.toString()}`
  }

  const importData = async (dataType: string, file: File) => {
    let url = `http://localhost:8080/api/rest/${dataType}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    conflictStore.reset();
    resourceStore.reset();
  }

  const dataForRange = useMemo(() =>
      data.filter((entry) => isDateInRange(entry.date, dateRange[0], dateRange[1])),
    [data, dateRange]
  );

  const labels = useMemo(() =>
      dataForRange.map((entry) => format(entry.date, 'MMM yyyy')),
    [dataForRange]
  );

  const datasets = useMemo<ChartDataset<"line">[]>(() => {
    if (!resourceInfo.subsets) {
      return [
        {
          label: resourceInfo!.name,
          data: dataForRange.map((entry) => (entry as ResourceDataEntry).price),
          pointRadius: 0,
          borderColor: resourceColors[selectedResource],
          backgroundColor: resourceColors[selectedResource] + '80',
        }
      ]
    }

    return Object.entries(resourceInfo.subsets).map(([key, title]) => ({
      label: title,
      data: dataForRange.map((entry) => (entry as ResourceSubsetDataEntry)[key]),
      pointRadius: 0,
      borderColor: (resourceColors[selectedResource] as Record<string, string>)[key],
      backgroundColor: (resourceColors[selectedResource] as Record<string, string>)[key] + '80',
    }))
  }, [dataForRange])

  const annotations = useMemo(() => conflictStore.conflicts
    .filter((conflict) => isDateInRange(conflict.date, dateRange[0], dateRange[1]))
    .map((conflict) => ({
      ...baseAnnotationOptions,
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
      value: format(conflict.date, 'MMM yyyy'),
    }) as AnnotationOptions<'line'>),
    [dateRange, conflictStore.conflicts]
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'no-wrap' }}>
        <Box sx={{
          height: '2px',
          width: '18px',
          marginRight: 1,
          '--line-color': blueGrey[400],
          background: 'linear-gradient(to right, var(--line-color), var(--line-color) 33%, white 33%, white 66%, var(--line-color) 66%);'
        }}></Box>
        <span style={{ fontSize: '.875rem' }}>Military conflicts</span>
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        <DateRangeSlider resourceInfo={resourceInfo}
                         dateRange={dateRange}
                         onChange={(value) => setDateRange(value)}/>
      </Box>
      <Divider/>
      <FileImportExportSection onExport={exportData} onImport={importData}/>
    </>
  )
}

interface DateRangeSliderProps {
  dateRange: number[];
  resourceInfo: Resource;
  onChange: (value: [number, number]) => void;
}

function DateRangeSlider({ dateRange, resourceInfo, onChange }: DateRangeSliderProps) {
  const dateMarks = useMemo(() =>
      eachYearOfInterval({ start: resourceInfo.minDate, end: resourceInfo.maxDate })
      .filter((date) => getYear(date) % 5 === 0)
      .map((date) => ({ label: format(date, 'yyyy'), value: getTime(date) })),
    [resourceInfo]
  );

  return (
    <Slider min={getTime(resourceInfo.minDate)}
            max={getTime(resourceInfo.maxDate)}
            valueLabelFormat={(value) => format(value, 'MMM yyyy')}
            marks={dateMarks}
            value={dateRange}
            onChange={(_, value) => onChange(value as [number, number])}
            valueLabelDisplay='auto'/>
  )
}
