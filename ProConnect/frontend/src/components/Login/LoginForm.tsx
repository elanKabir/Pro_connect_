import { Button, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_LOGINREQUEST_URL = `${BACKEND_API_URL}/v2/login`;

/**
 * LoginForm component is a form for user login.
 * @param {Object} props - The props object.
 * @param {Function} props.setTokenHandler - A function to handle the token after successful login.
 * @returns {JSX.Element} - The LoginForm component.
 */
const LoginForm = (props: {
  setTokenHandler: (token: string | null) => void;
}) => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    axios
      .post(API_LOGINREQUEST_URL, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data;
        toast.success('Login successful!');
        props.setTokenHandler(data.data.token);
        navigate('/');
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <Grid item>
        <TextField
          required
          id="email-required"
          label="Email"
          fullWidth
          defaultValue={email}
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          required
          id="password-required"
          label="Password"
          defaultValue={password}
          type="password"
          margin="normal"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item>
        <a href="/forgot-password">
          <p style={{ fontSize: '14px' }}>Forgot your password?</p>
        </a>
      </Grid>
      <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          style={{ width: '50%', height: '45px' }}
        >
          <span style={{ fontSize: '16px' }}>Login</span>
        </Button>
      </Grid>
      <Grid
        item
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <a href="/signup">
          <p>Don't have an account? Join Now</p>
        </a>
      </Grid>
    </form>
  );
};

export default LoginForm;
