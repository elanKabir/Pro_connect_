import React from 'react';
//import MakePage from '../components/MakePage';

import { Box, Grid, Typography } from '@mui/material';


import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

import ProfilePicture from './EditProfilePicture';


import { userDetails } from '../../apis/types';


type ProfileHeaderProps = {
    userDetails: userDetails
    token: string | null
    user_id: string | undefined
    avatarUrl: string
    setAvatar: React.Dispatch<React.SetStateAction<string>>,
};

const EditProfileHeader: React.FC<ProfileHeaderProps> = ({ token, userDetails, user_id, avatarUrl, setAvatar }) => {

    return (
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <Grid container spacing={2} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Grid item xs={12} style={
                    { height: 'auto', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ProfilePicture token={token} user_id={user_id} userDetails={userDetails} avatarUrl={avatarUrl} setAvatar={setAvatar} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    <Typography variant='h5'>{userDetails.entityname}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
                    <Typography variant="subtitle1" component="div">
                        <LocationOnIcon fontSize="inherit" style={{ verticalAlign: 'middle', marginBottom: '4', marginRight: '4' }} />
                        {userDetails.location}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                        <LocalPhoneIcon fontSize="inherit" style={{ marginLeft: '15', verticalAlign: 'middle', marginBottom: '4', marginRight: '4' }} />
                        {userDetails.phone}
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>
                    <Typography variant="subtitle1" component="div">
                        <EmailIcon fontSize="inherit" style={{ verticalAlign: 'middle', marginBottom: '3', marginRight: '4' }} />
                        {userDetails.email}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </Box>

    )
};
export default EditProfileHeader





