import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
//import UploadButton from '../uploadButton';
import { Button } from '@mui/material';
import EditProfileTextField from './EditProfileTextField';


type EditProfileProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    editMail?: string
    editPhone?: string
    editLocation?:string

    setEditMethods : {
        setEditMail?: (event: React.ChangeEvent<HTMLInputElement>) => void;
        setEditLocation?:(event: React.ChangeEvent<HTMLInputElement>) => void;
        setEditNumber?: (event: React.ChangeEvent<HTMLInputElement>) => void;
        setEdit?:  (event: React.MouseEvent<HTMLButtonElement>) => void;
    }
}

const EditProfileContents: React.FC<EditProfileProps> = (
    {editMail,
    setEditMethods,
    editPhone,
    editLocation}) => {


    return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    height="40vh">
        <Grid container spacing={2} style={{ width: '100vw', height: '100vh'}}>
            <Grid item xs={12} style={{ height: '8vh' }}>
                <EditProfileTextField label='New Email Address'  value={editMail}  onChange={setEditMethods.setEditMail}/>
            </Grid>
            <Grid item xs={12} style={{ height: '8vh' }}>
                <EditProfileTextField label = "New Phone Number"  value={editPhone} onChange={setEditMethods.setEditNumber} />
            </Grid>
            <Grid item xs={12} style={{ height: '8vh',   }}>
                <EditProfileTextField label = "New Location" value={editLocation} onChange={setEditMethods.setEditLocation} />
            </Grid>
            <Grid item xs={12} style={{
                height: 'auto',
                width:'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                fontSize:8}}>
                <Button size="medium" variant="contained" style={{ height: '5vh', width: '15vh'}} onClick={setEditMethods.setEdit}>Save</Button>
                <Button size="medium" variant="contained"  style={{ height: '5vh', width: '15vh'}}>Discard</Button>
                </Grid>
        </Grid>
    </Box>
    );
}
export default EditProfileContents