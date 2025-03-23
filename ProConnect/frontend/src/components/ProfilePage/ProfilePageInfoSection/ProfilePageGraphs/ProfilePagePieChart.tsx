import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

const pieParams = { height: 300, margin: { right: 5 } };
const palette = ['red', 'blue', 'green'];

export default function ProfilePagePieChart() {
  return (
    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
      <Box flexGrow={1}>
        <Typography>Repeat Hire Rate</Typography>
        <PieChart
          series={[{ data: [{ value: 10 }, { value: 15 }, { value: 20 }] }]}
          {...pieParams}
        />
      </Box>
      <Box flexGrow={1}>
      <Typography>Recomendation Rate</Typography>
        <PieChart
          series={[{ data: [ { value: 80 },{ value: 20 }] }]}
          {...pieParams}
        />
      </Box>
    </Stack>
  );
}
