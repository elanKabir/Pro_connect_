import * as React from 'react';

import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';
//import UploadButton from '../uploadButton';
import { Button } from '@mui/material';
import ConfirmationDialog from '../ConfirmationDialog';
import { confirmationDialog } from '../../apis/types';

type ConfirmationDialogProps = {
    confirmationDialog : confirmationDialog
};

const EditProfileDelete: React.FC<ConfirmationDialogProps> = ({confirmationDialog
}) =>
{


    return (
    <Box
    sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
        <Grid container spacing={2} sx={{alignItems:"center", justifyContent:"center"}} >
            <Grid item xs={0}justifyContent="center" alignItems="center">
                <Button variant='contained'color="error" onClick={confirmationDialog.openDialog}>Delete Account</Button>
                <ConfirmationDialog
                    title={confirmationDialog.title}
                    content={confirmationDialog.content}
                    cancelButton={confirmationDialog.cancelButton}
                    confirmButton={confirmationDialog.confirmButton}
                    openStatus={confirmationDialog.openStatus}
                    actionFn={confirmationDialog.actionFn}
                    onClose={confirmationDialog.onClose}
                    />
            </Grid>
        </Grid>
    </Box>
  );
  }
export default EditProfileDelete