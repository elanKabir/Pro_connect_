import { Typography, Box, Grid, Paper } from '@mui/material';
import MakePage from '../components/MakePage';
import LoginForm from '../components/Login/LoginForm';

/**
 * Renders a login page with a login form.
 * @param {Object} props - The props object.
 * @param {Function} props.setTokenHandler - The function to handle setting the token.
 * @returns {JSX.Element} - The login page component.
 */
const Login = (props: { setTokenHandler: (token: string | null) => void }) => {
  return (
    <>
      <MakePage
        pageTitle="Sign In"
        token={null}
        setTokenHandler={props.setTokenHandler}
        pageElement={
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Paper
                sx={{
                  padding: 3,
                  minWidth: '35%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h5">Sign In</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <LoginForm setTokenHandler={props.setTokenHandler} />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </>
        }
      />
    </>
  );
};

export default Login;
