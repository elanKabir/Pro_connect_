import React, { useEffect, useState } from 'react';
import MakePage from '../../../MakePage';
import jwt from 'jwt-decode';
import { Accordion, Box, Grid, Tab, Typography } from '@mui/material';
//import makeRequestFn from '../apis/makeRequest';
import ProfileRecentProjectModal from './ProfileRecentProjectModal';

type ProfileRecentProjectProps = {
    token: string | null;
    user: User
}

type User = {
    uid: string;
    email: string;
    entityname: string;
    abn: string;
    role: string;
};

const ProfileRecentProject: React.FC<ProfileRecentProjectProps> = ({token, user}) => {

    const numberOfProjects = 6;
    const projectsArray: JSX.Element[] = [];

    for (let i = 0; i < numberOfProjects; i++) {
        projectsArray.push(
        <Grid
            item
            xs={12}     // Full width on extra small devices
            sm={6}     // 2 images in a row on small devices
            md={4}     // 3 images in a row on medium and up
            key={i}>
            <ProfileRecentProjectModal
                projectTitle ={'Place Holder Title'}
                projectPostDate = {'04/9/2023'}
                projectStatus = {'In Progress'}
                projectBudget = {'$500'}
                user = {user}
            />
        </Grid>);
    }
    return (
        <Box
        sx={{
        display:'flex',
        justifyContent:'flex-start',
        flexDirection:'row',
        flexWrap:'wrap'}}
        >
            <Grid container spacing={2} style={{ padding: 16 }}>
                {projectsArray}
            </Grid>
        </Box>
    )
}

export default ProfileRecentProject;
