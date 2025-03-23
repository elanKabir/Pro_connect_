import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
//import UploadButton from '../uploadButton';
import { Button } from '@mui/material';
import EditProfileTextField from './EditProfileTextField';
import { EditSetters, EditValues, userDetails } from '../../apis/types';


type EditProfileProps = {
    EditValues: EditValues
    EditSetters: EditSetters
    userDetails: userDetails
}

const EditProfileForm: React.FC<EditProfileProps> = ({ EditValues, EditSetters, userDetails }) => {

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <Grid container spacing={1} >
                {userDetails.role === '30' && (
                    <Grid item xs={12}>
                        <EditProfileTextField label='New Name' value={EditValues.editName} onChange={(event) => EditSetters.setEditName(event.target.value)} />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <EditProfileTextField label='New Email Address' value={EditValues.editMail} onChange={(event) => EditSetters.setEditEmail(event.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <EditProfileTextField label="New Phone Number" value={EditValues.editPhone} onChange={(event) => EditSetters.setEditPhone(event.target.value)} />
                </Grid>
                <Grid item xs={12}>
                    <EditProfileTextField label="New Location" value={EditValues.editLocation} onChange={(event) => EditSetters.setEditLocation(event.target.value)} />
                </Grid>
                <Grid item xs={12} style={{
                    height: 'auto',
                    width: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    fontSize: 8
                }}>
                    <Button size="medium" variant="contained" onClick={EditSetters.setEdit}>Save</Button>
                    <Button size="medium" variant="contained" onClick={EditSetters.onDiscardEditForm}>Discard</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
export default EditProfileForm