/*
import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { Accordion, Box, Grid, Tab, Typography } from '@mui/material';
import BasicTab from './BasicTab';
import ProfilePageBio from '../ProfilePageBio/ProfilePageBio';
import ReviewPagination from '../../ReviewPagination';
import ProjectCard from '../../ProjectCard';
import SkillsInput from '../../Skills';
import ProjectPagination from '../../ProjectPagination';
import InputFileUpload from '../../UploadCV';
import makeRequestFn from '../../../../apis/makeRequest';
import CV from '../../CV';
import { userDetails, User,userProfileProjectStats , Cv_information, ProfilePageObject,} from '../../../../apis/types';

interface ProfileTabProps {
    tabLabels?: string[];
    ProfilePageObject: ProfilePageObject
}


type ProjectFields = {
    project_id:string;
    title: string;
    deadline: string;
    status: string;
    budget: string;
    description: string;
    category: string;
    professional_num:string;
    postDate:string;
    project_type: string | null
    project_date_created: string
    project_location: string | null
}

*/

const ProfessionalTab: React.FC = () => {
    return (<></>)



 
}
export default ProfessionalTab;


    /*
    const [allProjects, setAllProject] = React.useState<ProjectFields[]>([]);

    const getProjectStats = (data: [any]) => {
        const projects = data
        const sortedProjects = projects.sort((a, b) => new Date(b.project_date_created).getTime() - new Date(a.project_date_created).getTime());
        const recentProjects = sortedProjects.slice(0, 6);
        setAllProject(recentProjects)
    }
    useEffect(() => {
        makeRequestFn('/view_my_projectlist','GET', undefined, token, getProjectStats);
    }, [token]);

    const bioTestText = 'ut diam quam nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc'
    //DECODE JWT TOKEN
    try {
        var user: User = jwt(token!);
        //console.log(user)
        } catch (error) {
        user = {
            uid: 'null',
            email: 'null',
            entityname: 'null',
            abn: 'null',
            role: 'null',
        };
        
    }
    //Headings for the acutal tabs and place components for the component
    const tabsData = [
        {
            label: "Recent Projects",
            content: <ProjectPagination projects={allProjects}/>
        },
        {
            label: "Reviews", content:
            <ReviewPagination/>
        },
        {
            label: "Skills", content:<SkillsInput token={token} user_id={user_id} user={user} userDetails={userDetails} isUsersProfile={isUsersProfile} />
        },
        {
            label: "CV", content:<CV token={token} user_id={user.uid} />
        }
    ];
    return (
        <Box>
            <BasicTab tabs={tabsData}/>
        </Box>
    );
}

*/