import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel, Grid, InputLabel, MenuItem,
  Radio,
  RadioGroup, Select,
  Stack,
  Typography
} from '@mui/material';
import { Resources, useResourceStore } from './stores/resourceStore';
import { useAuthStore } from './stores/authStore';

export function FileImportExportSection({ onImport, onExport }: FileExportSectionProps & FileImportSectionProps) {
  const authStore = useAuthStore();

  return (
    <Grid container>
      <Grid item xs={6}>
        <FileExportSection onExport={onExport}/>
      </Grid>
      {
        authStore.isAdmin() ?
          <Grid item xs={6}>
            <FileImportSection onImport={onImport}/>
          </Grid> : null
      }
    </Grid>
  )
}

interface FileExportSectionProps {
  onExport: (dataSource: string, fileType: string) => void;
}

export function FileExportSection({ onExport }: FileExportSectionProps) {
  const [dataSource, setDataSource] = useState('date-range');
  const [fileType, setFileType] = useState('json');

  return (
    <Stack spacing={2}>
      <Typography variant='h6' component='h6'>Export data</Typography>
      <Stack direction='row' spacing={5}>
        <FormControl>
          <FormLabel>Data source</FormLabel>
          <RadioGroup row value={dataSource} onChange={(_, value) => setDataSource(value)}>
            <FormControlLabel value='date-range' control={<Radio/>} label='Visible range'/>
            <FormControlLabel value='all' control={<Radio/>} label='All data'/>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>File type</FormLabel>
          <RadioGroup row value={fileType} onChange={(_, value) => setFileType(value)}>
            <FormControlLabel value='json' control={<Radio/>} label='JSON'/>
            <FormControlLabel value='xml' control={<Radio/>} label='XML'/>
          </RadioGroup>
        </FormControl>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant='contained' onClick={() => onExport(dataSource, fileType)}>Export</Button>
      </Box>
    </Stack>
  )
}

interface FileImportSectionProps {
  onImport: (dataType: string, file: File) => void;
}

type DataTypes = Resources | 'conflicts'

export function FileImportSection({ onImport }: FileImportSectionProps) {
  const resourceStore = useResourceStore();
  const [dataType, setDataType] = useState<DataTypes | ''>('');
  const [file, setFile] = useState<File | undefined>(undefined);

  const resourceTypes = Object.fromEntries(
    Object.entries(resourceStore.resources)
    .map(([resource, resourceInfo]) => [resource, resourceInfo.name])
  );

  const dataTypes = {
    conflicts: 'Military conflicts',
    ...resourceTypes,
  } as Record<DataTypes, string>

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0]);
  }

  return (
    <Stack spacing={2}>
      <Typography variant='h6' component='h6'>Import data</Typography>
      <Stack direction='row' spacing={2}>
        <FormControl fullWidth sx={{ maxWidth: '200px' }}>
          <InputLabel>Data type</InputLabel>
          <Select label='Data type' value={dataType} onChange={(event) => setDataType(event.target.value as DataTypes)}>
            <MenuItem value=''>None</MenuItem>
            {Object.entries(dataTypes).map(([key, title]) => <MenuItem key={key} value={key}>{title}</MenuItem>)}
          </Select>
        </FormControl>
        <Button component='label'>
          {file ? file.name : 'Choose file'}
          <input type='file' onChange={onFileChange} hidden/>
        </Button>
      </Stack>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant='contained' onClick={() => (file && dataType) ? onImport(dataType, file!) : null}>Import</Button>
      </Box>
    </Stack>
  )
}
