import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

const TextFieldWithSearchButton = (props: {
  label: string;
  required: boolean;
  fullWidth: boolean;
  margin: 'dense' | 'none' | 'normal' | undefined;
  onClickFunction: () => void;
  onChangeFunction?: (e: any) => void;
}) => {
  return (
    <FormControl
      variant="outlined"
      required={props.required}
      fullWidth={props.required}
      margin={props.margin}
    >
      <InputLabel>{props.label}</InputLabel>
      <OutlinedInput
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="Search"
              edge="end"
              onClick={props.onClickFunction}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
        label={props.label}
        inputProps={{
          onChange: props.onChangeFunction,
        }}
      />
    </FormControl>
  );
};

export default TextFieldWithSearchButton;
