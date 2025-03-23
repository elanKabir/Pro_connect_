import React from 'react';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MakePage from '../components/MakePage';
import CreateProjectForm from '../components/Projects/CreateProjectForm';

type CreateProjectPageProps = {
    setTokenHandler: (token: string | null) => void;
    token: string | null;
  };


  const CreateProject: React.FC<CreateProjectPageProps> = ({ setTokenHandler, token }) => {
    return (
      <MakePage
        pageTitle="Create Project"
        token={token}
        setTokenHandler={setTokenHandler}
        pageElement={
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={8}>
              <Paper
                sx={{
                  padding: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    marginBottom: '1rem',
                    textAlign: 'center', 
                    fontSize: { xs: '24px', sm: '30px' },
                  }}
                >
                  Create Project
                </Typography>
                <CreateProjectForm />
              </Paper>
            </Grid>
          </Grid>
        }
      />
    );
  };
  
  export default CreateProject;
