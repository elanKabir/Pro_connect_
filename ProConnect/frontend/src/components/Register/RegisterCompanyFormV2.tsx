import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import TextFieldWithSearchButton from '../Textfield/TextFieldWithSearchButton';
import { fetchWithJsonp } from '../../apis/abnLookup';
import { ABN_GUID } from '../../apis/ABNLookUpV2';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_API_URL } from '../../apis/config';
import { useNavigate } from 'react-router-dom';

const REGISTER_URL = BACKEND_API_URL + '/v2/register';

/**
 * A form component for registering a company.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - A function to handle setting the authentication token.
 * @returns {JSX.Element} - The RegisterCompanyFormV2 component.
 */
const RegisterCompanyFormV2 = (props: {
  setTokenHandler: (token: string | null) => void;
}) => {
  const navigate = useNavigate();

  const [abn, setAbn] = React.useState<string>('');
  const [abnValidated, setAbnValidated] = React.useState<boolean>(false);
  const [companyName, setCompanyName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [number, setNumber] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');

  const searchABN = () => {
    fetchWithJsonp(abn, ABN_GUID);
    window.callbackFunction = function (data: any) {
      if (data.AbnStatus === 'Active' && data.EntityTypeCode !== 'IND') {
        console.log('Received data:', data.Abn);
        setAbnValidated(true);
        setCompanyName(data.EntityName);
        setLocation(data.AddressState + ', ' + data.AddressPostcode);
      } else {
        toast.error('ABN Number is invalid or is a Sole Trader ABN.');
      }
    };
  };

  const registerButtonDisabled = () => {
    return (
      !abnValidated ||
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) ||
      password !== confirmPassword ||
      email.length < 1 ||
      password.length < 1 ||
      confirmPassword.length < 1 ||
      number.length < 1 ||
      location.length < 1
    );
  };

  // If ABN changes reset the ABN validated state
  React.useEffect(() => {
    setAbnValidated(false);
  }, [abn]);

  const handleCompanyRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!abnValidated) {
      toast.error('Please validate your ABN');
      return;
    }
    // Handle the register logic here
    const registerData = {
      email: email,
      password: password,
      phone: number,
      location: location,
      entityname: companyName,
      role: '20',
      abn: abn.replace(/\s/g, ''),
    };

    axios
      .post(REGISTER_URL, registerData)
      .then((response) => {
        props.setTokenHandler(response.data.token);
        navigate('/');
        toast.success('Registration successful! Welcome to ProConnect!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <form onSubmit={handleCompanyRegister}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <TextFieldWithSearchButton
            label="ABN Number"
            required
            fullWidth
            onClickFunction={() => {
              searchABN();
            }}
            onChangeFunction={(e) => {
              setAbn(e.target.value);
            }}
            margin={undefined}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Company Name"
            onChange={(e) => {
              setCompanyName(e.target.value);
            }}
            value={companyName}
            disabled={abnValidated}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            error={
              !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
              ) && email.length > 0
            }
            helperText={
              email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
              ) || email.length < 1
                ? ''
                : 'Please enter a valid email address'
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            error={
              (password !== confirmPassword && confirmPassword.length > 0) ||
              (password.length < 6 && password.length > 0)
            }
            helperText={
              (password === confirmPassword || confirmPassword.length < 1) &&
              (password.length >= 6 || password.length === 0)
                ? ''
                : password.length < 6
                ? 'Password must be at least 6 characters'
                : 'Passwords do not match'
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Phone Number"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Location"
            disabled={abnValidated}
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            // style={{ width: '50%', height: '45px' }}
            disabled={registerButtonDisabled()}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterCompanyFormV2;
