import React, { useEffect, useState } from 'react';
import MakePage from './MakePage';
import jwt from 'jwt-decode';
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
import { start } from 'repl';
import { wrap } from 'module';
import ProjectModal from './ProjectModal';

type ProfileRecentProjectProps = {
    token?:string
}


const ProfileRecentProject: React.FC<ProfileRecentProjectProps> = ({token}) => {
    return (
        <>
        <Box
        sx={{
        display:'flex',
        justifyContent:'flex-start',
        flexDirection:'row',
        flexFlow:'flow'}}>
        <Grid container spacing={1} style={{backgroundColor:'turquoise'}}>
            <Grid item xs={4} style={{ backgroundColor:'blue' }}>
            <ProjectModal/>
            </Grid>
            <Grid item xs={4} style={{ backgroundColor:'blue' }}>
                <ProfileProjectCard/>
            </Grid>
            <Grid item xs={4} style={{backgroundColor:'blue' }}>
                <ProfileProjectCard/>
            </Grid>
            <Grid item xs={4} style={{backgroundColor:'blue' }}>
                <ProfileProjectCard/>
            </Grid>
            <Grid item xs={4} style={{ backgroundColor:'blue' }}>
                <ProfileProjectCard/>
            </Grid>
            <Grid item xs={4} style={{ backgroundColor:'blue' }}>
                <ProfileProjectCard/>
            </Grid>
        </Grid>

        </Box>
        </>
    )
}

export default ProfileRecentProject;
