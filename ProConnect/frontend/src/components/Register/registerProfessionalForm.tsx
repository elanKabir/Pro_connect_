import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TextFieldWithSearchButton from '../Textfield/TextFieldWithSearchButton';
import { ABN_GUID } from '../../apis/ABNLookUpV2';
import { toast } from 'react-toastify';
import { fetchWithJsonp } from '../../apis/abnLookup';
import { Button } from '@mui/material';
import axios from 'axios';
import { BACKEND_API_URL } from '../../apis/config';
import { useNavigate } from 'react-router-dom';

const REGISTER_URL = BACKEND_API_URL + '/v2/register';

/**
 * A form component for registering a professional user.
 * @param {Object} props - The props object.
 * @param {Function} props.setTokenHandler - A function to set the authentication token.
 * @returns {JSX.Element} - A JSX element representing the register professional form.
 */
const RegisterProfessionalForm = (props: {
  setTokenHandler: (token: string | null) => void;
}) => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = React.useState<string>('');
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [number, setNumber] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');
  const [abn, setAbn] = React.useState<string>('');

  // ABN Verified State
  const [abnValidated, setAbnValidated] = React.useState<boolean>(false);

  // Check if ABN is a IND and active, if it is set First name,
  // Last name and location and disable the textfield.
  const searchABN = () => {
    fetchWithJsonp(abn, ABN_GUID);
    window.callbackFunction = function (data: any) {
      if (data.AbnStatus === 'Active' && data.EntityTypeCode === 'IND') {
        console.log('Received data:', data.Abn);
        setAbnValidated(true);
        setFirstName(data.EntityName.split(',')[1]);
        setLastName(data.EntityName.split(',')[0]);
        setLocation(data.AddressState + ', ' + data.AddressPostcode);
      } else {
        toast.error('ABN Number is invalid or is not a Sole Trader ABN.');
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

  // const containerStyle = {
  //   display: 'flex',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  //   minHeight: '65vh',
  // };

  // const formContainerStyle = {
  //   width: '750px',
  // };

  const handleProRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!abnValidated) {
      toast.error('Please validate your ABN');
      return;
    }
    // register logic
    const registerData = {
      email: email,
      password: password,
      phone: number,
      location: location,
      entityname: firstName + ' ' + lastName,
      role: '30',
      abn: abn.replace(/\s/g, ''),
    };

    axios
      .post(REGISTER_URL, registerData)
      .then((response) => {
        const data = response.data;

        props.setTokenHandler(data.data.token);
        navigate('/');
        toast.success('Registration successful! Welcome to ProConnect!');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <form onSubmit={handleProRegister}>
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="First Name"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            value={firstName}
            disabled={abnValidated}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Last Name"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            value={lastName}
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
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zAZ0-9-]+)*$/
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
            disabled={registerButtonDisabled()}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterProfessionalForm;
