import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
//import UploadButton from '../uploadButton';
import { Button } from '@mui/material';
import  EditProfileTextField from './EditProfileTextField';


type EditProfileProps = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    editMail: string
    editPhone: string
    editLocation:string
    editName:string

    setEditMethods : {
        setEditMail: (event: React.ChangeEvent<HTMLInputElement>) => void;
        setEditLocation:(event: React.ChangeEvent<HTMLInputElement>) => void;
        setEditNumber: (event: React.ChangeEvent<HTMLInputElement>) => void;
        setEdit :  (event: React.MouseEvent<HTMLButtonElement>) => void;
        onDiscardEditForm:(event: React.MouseEvent<HTMLButtonElement>) => void;
        setEditName:(event: React.ChangeEvent<HTMLInputElement>) => void;
    }
}

const EditProfileProfessionalForm: React.FC<EditProfileProps> = (
    {editMail,
    setEditMethods,
    editPhone,
    editName,
    editLocation}) => {
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));



    return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center">
        <Grid container spacing={1} >
            <Grid item xs={12}>
                <EditProfileTextField label='New Name'  value={editName}  onChange={setEditMethods.setEditName}/>
            </Grid>
            <Grid item xs={12}>
                <EditProfileTextField label='New Email Address'  value={editMail}  onChange={setEditMethods.setEditMail}/>
            </Grid>
            <Grid item xs={12}>
                <EditProfileTextField label = "New Phone Number"  value={editPhone} onChange={setEditMethods.setEditNumber} />
            </Grid>
            <Grid item xs={12}>
                <EditProfileTextField label = "New Location" value={editLocation} onChange={setEditMethods.setEditLocation} />
            </Grid>
            <Grid item xs={12} style={{
                height: 'auto',
                width:'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                fontSize:8}}>
                    <Button size="medium" variant="contained" onClick={setEditMethods.setEdit}>Save</Button>
                    <Button size="medium" variant="contained" onClick={setEditMethods.onDiscardEditForm}>Discard</Button>
            </Grid>
        </Grid>
    </Box>
  );
  }
export default EditProfileProfessionalForm