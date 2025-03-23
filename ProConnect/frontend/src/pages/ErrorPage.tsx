/**
 * ErrorPage component displays a 404 error page with a message and a button to navigate back to the home page.
 */
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1" style={{ color: 'black' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'black' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          navigate('/');
        }}
      >
        Back Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
