import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React from 'react';

interface DropdownMenuWithSelectProps {
  label: string;
  options: string[];
  selectedOptions?: string[];
  setSelectedOptions?: (
    options: string[]
  ) => void | ((options: string) => void);
  multiple?: boolean; // add a new prop to indicate whether multiple options can be selected
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const DropdownMenuWithSelect: React.FC<DropdownMenuWithSelectProps> = ({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  multiple = false, // set a default value for the multiple prop
}) => {
  const handleChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions!(
      typeof value === 'string' ? value.split(', ') : value || []
    ); // provide a default value of an empty array
  };
  return (
    <FormControl fullWidth sx={{ m: 1 }} variant="filled">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple={multiple} // pass the multiple prop to the Select component
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => {
          return selected.join(', ');
        }}
        MenuProps={MenuProps}
      >
        {options.map((option) =>
          // conditionally render a Checkbox or a normal MenuItem based on the multiple prop
          multiple ? (
            <MenuItem key={option} value={option}>
              <Checkbox
                checked={
                  selectedOptions?.indexOf(option) !== undefined &&
                  selectedOptions?.indexOf(option) > -1
                }
              />
              <ListItemText primary={option} />
            </MenuItem>
          ) : (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default DropdownMenuWithSelect;
