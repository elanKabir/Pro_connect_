import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import ConfirmationDialog from '../ConfirmationDialog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type DeleteProjectProps = {
  openStatus: boolean;
  openDialog: () => void;
  onClose: () => void;
  deleteProject: () => Promise<void>; 
  title: string;
  content: string;
  cancelButton: string;
  confirmButton: string;
};


const deleteProject = () => {
    toast.success('deleted projectsuccessfully');
  };


const DeleteProject: React.FC<DeleteProjectProps> = ({
   
  }) => {
    const navigate = useNavigate();
  
    const [deleteProjectDialog, setDeleteProjectDialog] = useState<boolean>(false);
  
    const openDialog = () => {
        setDeleteProjectDialog(true);
      };
      
    const handleDeleteProject = () => {
      deleteProject();
      setDeleteProjectDialog(false);
      toast.success('Project deleted successfully');
      navigate('/');
    };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
        <Grid item xs={0} justifyContent="center" alignItems="center">
          <Button variant='contained' color="error" 
          onClick={openDialog}>Delete Project</Button>
          <ConfirmationDialog
            title={"Confirm Project Deletion?"}
            content={" This cannot be undone"}
            cancelButton={"Cancel"}
            confirmButton={"Delete Project"}
            openStatus={deleteProjectDialog}
            actionFn={handleDeleteProject}
            onClose={() => {
                setDeleteProjectDialog(false);
              }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeleteProject;