import React from 'react';
import SwitchButton from '../components/Register/switchButton';
import { Box, Paper } from '@mui/material';
import RegisterProfessionalForm from '../components/Register/registerProfessionalForm';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MakePage from '../components/MakePage';
import RegisterCompanyFormV2 from '../components/Register/RegisterCompanyFormV2';

declare global {
  interface Window {
    callbackFunction: (e: any) => void;
  }
}

type registerPageProps = {
  setTokenHandler: (token: string | null) => void;
};

/**
 * Renders a page for user registration.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - A function to set the authentication token.
 * @returns {JSX.Element} - The rendered component.
 */
const Register: React.FC<registerPageProps> = ({ setTokenHandler }) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <MakePage
        pageTitle="Sign Up"
        token={null}
        setTokenHandler={setTokenHandler}
        pageElement={
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
              }}
            >
              <Paper
                sx={{
                  padding: 2,
                }}
              >
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h5">Sign Up</Typography>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SwitchButton onChange={handleChange} />
                </Grid>
                <Grid item>
                  {checked ? (
                    <RegisterCompanyFormV2 setTokenHandler={setTokenHandler} />
                  ) : (
                    <RegisterProfessionalForm
                      setTokenHandler={setTokenHandler}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <a href="/signin">
                    <p>Have an account? Sign in Now</p>
                  </a>
                </Grid>
              </Paper>
            </Box>
          </>
        }
      />
    </>
  );
};

export default Register;
