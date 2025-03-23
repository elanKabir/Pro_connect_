import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BACKEND_API_URL } from '../apis/config';

const API_PASSWORDCHANGE_URL = `${BACKEND_API_URL}/change_password`;

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const makePasswordChangeRequest = async (data: object): Promise<void> => {
    try {
        const response = await fetch(API_PASSWORDCHANGE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            alert('Invalid Email, please try it again');
            return;
        } else if (response.status === 400) {
            alert('Missing email or password.');
            return;
        }  else if (!response.ok) {
          alert('Connection is failed')
          return;
        }

        const returnData = await response.json();
        if (returnData.error) {
            alert(returnData.error);
        } else {
            console.log(returnData);
            console.log("Success!");
            navigate('/Login');
        }
    } catch (error) {
        console.error('Unknown error:', error);
        alert('Some unknown error happened!');
    }
  } 

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      const data = {
            'email': email,
            'password': confirmPassword,
      }
      makePasswordChangeRequest(data);
      console.log('Password changed successfully');
    } else {
      console.error('New passwords do not match');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Typography variant="h4">Change Password</Typography>
            <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={handleEmailChange}
                inputProps={{ autoComplete: "email" }}
            />
            <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={handleNewPasswordChange}
                inputProps={{ autoComplete: "new-password" }}
            />
            <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                inputProps={{ autoComplete: "new-password" }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"  
                onClick={handlePasswordChange}
            >
                Change Password
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePassword;