import * as React from 'react';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * A switch button component that allows the user to toggle between professional and company modes.
 *
 * @param onChange - A function that will be called when the switch button is toggled.
 */
const SwitchButton: React.FC<Props> = ({ onChange }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ marginTop: '20px' }}
    >
      <Typography>Professional</Typography>
      <Switch onChange={onChange} color="default" />
      <Typography>Company</Typography>
    </Stack>
  );
};
export default SwitchButton;
