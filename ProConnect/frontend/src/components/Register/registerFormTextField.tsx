import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

type RegisterFormTextFieldProps = {
  label: string;
  withButton?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const inputStyle = {
  height: '60px',
  width: '70%',
  marginBottom: '20px',
  textAlign: 'center',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  justifyContent: 'center',
};

/**
 * A text field component for registration forms.
 * @param label - The label for the text field.
 * @param withButton - Whether or not to include a search button.
 * @param onClick - The function to call when the search button is clicked.
 * @param value - The current value of the text field.
 * @param onChange - The function to call when the text field value changes.
 * @param type - The type of the text field input.
 */
const RegisterFormTextField: React.FC<RegisterFormTextFieldProps> = ({
  label,
  withButton,
  onClick,
  value,
  onChange,
  type,
}) => {
  return (
    <div style={containerStyle}>
      <TextField
        type={type}
        fullWidth
        label={label}
        variant="outlined"
        value={value}
        onChange={onChange}
        sx={{ width: '70%', mb: 2 }}
        InputProps={{
          sx: inputStyle,
          endAdornment: withButton ? (
            <InputAdornment position="end">
              <IconButton onClick={onClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </div>
  );
};
export default RegisterFormTextField;
