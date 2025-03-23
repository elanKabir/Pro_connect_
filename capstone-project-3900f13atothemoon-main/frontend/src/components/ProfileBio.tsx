import { Accordion, Box, Grid, Tab, Typography } from '@mui/material';
import makeRequestFn from '../apis/makeRequest';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BasicTabs from './Tab';
import ScrollableTabsButtonPrevent from './Tab';
import ProfileProjectCard from './ProfileProjectCard';
import React from 'react';

type ProfileBioProps = {
    token?:string
}


const ProfileBio: React.FC<ProfileBioProps> = ({token}) => {
    return (
        <Box>
            Currently No Compnay Bio
        </Box>

    )
}

export default ProfileBio;
