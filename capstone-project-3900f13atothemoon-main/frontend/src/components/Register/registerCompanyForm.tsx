import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import RegisterFormTextField from './registerFormTextField';

type RegisterCompanyFormProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value?: string;

  AbnInput: string;
  EmailInput: string;
  PasswordInput: string;
  PhoneNumberInput: string;
  CompanyNameInput: string;
  LocationInput: string;
  ConfirmPassword: string;

  setMethods: {
    setAbnInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setCompanyNameInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setLocationInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setEmailInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setPasswordInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setNumberInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setConfirmPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
};

/**
 * A form component for registering a company.
 * @param {string} value - The value of the form.
 * @param {function} onClick - The function to be called when the button is clicked.
 * @param {object} setMethods - An object containing functions to set the input values.
 * @param {string} EmailInput - The value of the email input.
 * @param {string} PasswordInput - The value of the password input.
 * @param {string} PhoneNumberInput - The value of the phone number input.
 * @param {string} CompanyNameInput - The value of the company name input.
 * @param {string} LocationInput - The value of the location input.
 * @param {string} ConfirmPassword - The value of the confirm password input.
 * @param {string} AbnInput - The value of the ABN input.
 * @returns {JSX.Element} A form component for registering a company.
 */
const RegisterCompnayForm: React.FC<RegisterCompanyFormProps> = ({
  value,
  onClick,
  setMethods,
  EmailInput,
  PasswordInput,
  PhoneNumberInput,
  CompanyNameInput,
  LocationInput,
  ConfirmPassword,
  AbnInput,
}) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="70vh"
    >
      <Grid container spacing={9} style={{ width: '70vw', height: '58vh' }}>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="ABN No"
            value={AbnInput}
            onChange={setMethods.setAbnInput}
            onClick={onClick}
            withButton
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Company Email Address"
            value={EmailInput}
            onChange={setMethods.setEmailInput}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Company Name"
            value={CompanyNameInput}
            onChange={setMethods.setCompanyNameInput}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Create Password"
            type="password"
            value={PasswordInput}
            onChange={setMethods.setPasswordInput}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Comfirm Password"
            type="password"
            value={ConfirmPassword}
            onChange={setMethods.setConfirmPassword}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Phone Number"
            value={PhoneNumberInput}
            onChange={setMethods.setNumberInput}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '10vh' }}>
          <RegisterFormTextField
            label="Company Location"
            value={LocationInput}
            onChange={setMethods.setLocationInput}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default RegisterCompnayForm;
