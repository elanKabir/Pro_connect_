import React, { useState, useEffect } from 'react';
import { BACKEND_API_URL } from '../../apis/config';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProjectApplyProps {
  token: string | null;
  pid: string | undefined | null;
  uid: string | undefined | null;
}

type ApplicationDetails = {
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  proposed_deadline: string;
  proposal: string;
  date_applied: string;
};

const API_VIEW_APPLICATION_URL = `${BACKEND_API_URL}/view_user_application`;

const ViewApplicantForm: React.FC<ProjectApplyProps> = ({
  token,
  pid,
  uid,
}) => {
  const [applicationDetails, setApplicationDetails] =
    useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(API_VIEW_APPLICATION_URL, {
        params: { project_id: pid, user_id: uid },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setApplicationDetails(response.data.data);
      })
      .catch((e) => {
        setError(
          e.response?.data?.message || 'An error occurred while fetching data'
        );
        toast.error(e.response?.data?.message || 'An error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, pid, uid]);

  const handleBackToList = () => {
    navigate(-1);
  };

  const renderApplicationDetails = () => (
    <List>
      {Object.entries(applicationDetails || {}).map(([key, value]) => (
        <ListItem key={key}>
          <ListItemText
            primary={
              key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
            }
            secondary={value}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ padding: '20px' }}
    >
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Applicant Details
            </Typography>
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="subtitle1" color="error">
                {error}
              </Typography>
            ) : applicationDetails ? (
              renderApplicationDetails()
            ) : (
              <Typography variant="subtitle1">
                No application details available.
              </Typography>
            )}
          </CardContent>
          <Button
            color="primary"
            variant="contained"
            style={{ margin: '10px' }}
            onClick={handleBackToList}
          >
            Back to List
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewApplicantForm;
