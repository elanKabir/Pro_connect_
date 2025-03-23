import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
//import UploadButton from '../uploadButton';
import { Button } from '@mui/material';
import EditProfileTextField from './EditProfileTextField';
import { EditSetters, EditValues } from '../../apis/types';

type ChangePasswordFormProps = {
    EditValues : EditValues
    EditSetters: EditSetters
}


const EditProfileChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    EditValues,EditSetters
}) =>{
    return (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center">
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <Grid container spacing={1} >
                <Grid item xs={12} >
                    <EditProfileTextField
                        label='Current Password'
                        type='password'
                        value={EditValues.currentPassword}
                        onChange={(event) => EditSetters.setCurrentPassword(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <EditProfileTextField
                        type='password'
                        label = "New Password"
                        value={EditValues.newPassword}
                        onChange={(event) => EditSetters.setNewPassword(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <EditProfileTextField
                        type='password'
                        label = "Confirm New Password"
                        value={EditValues.confirmNewPassword}
                        onChange={(event) => EditSetters.setConfirmNewPassword(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12} style={{
                    height: 'auto',
                    width:'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    fontSize:8}}>
                    <Button size="medium" variant="contained"  onClick={EditSetters.onPasswordChangeFn}>Change</Button>
                    <Button size="medium" variant="contained" onClick={EditSetters.onDiscardPasswordForm}>Discard</Button>
                </Grid>
            </Grid>
        </Box>
    </Box>
    );
}
export default EditProfileChangePasswordForm