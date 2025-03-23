import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { Accordion, Box, Grid, Tab, Typography } from '@mui/material';
import BasicTab from './BasicTab';
import ProfilePageBio from '../ProfilePageBio/ProfilePageBio';
import ReviewPagination from '../../ReviewPagination';
import ProjectCard from '../../ProjectCard';
import SkillsInput from '../../Skills';
import ProjectPagination from '../../ProjectPagination';
import makeRequestFn from '../../../../apis/makeRequest';
import { toast } from 'react-toastify';
/*
interface ProfileTabProps {
    tabLabels?: string[];
    token: string | null;
}
type User = {
    uid: string;
    email: string;
    entityname: string;
    abn: string;
    role: string;
};

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


const CompanyTab: React.FC = () => {
    /*
    const [allProjects, setAllProject] = React.useState<ProjectFields[]>([]);
    const [bioText, setBioText]= React.useState<string>('');

    const getProjectStats = (data: [any]) => {
        const projects = data
        const sortedProjects = projects.sort((a, b) => new Date(b.project_date_created).getTime() - new Date(a.project_date_created).getTime());
        const recentProjects = sortedProjects.slice(0, 6);
        setAllProject(recentProjects)
    }
    const handleBioText = (data :any) => {
        if (data.user_info.company_bio === null) {
            setBioText('')
        } else {
            setBioText(data.user_info.company_bio)
        }
    }
    const handleBioChange = async (newBio :string) => {
        const body = {
            user_id: user.uid,
            company_bio:newBio
        }
        await makeRequestFn('/add_company_bio','POST', body, token, undefined);
        await makeRequestFn('/userdetail?user_id=' + user.uid,'GET', undefined, token, handleBioText);
        toast.success('Bio has been changed successfully')
    }

    useEffect(() => {
        makeRequestFn('/view_my_projectlist','GET', undefined, token, getProjectStats);
        makeRequestFn('/userdetail?user_id=' + user.uid,'GET', undefined, token, handleBioText);
    }, [token]);

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
            label: "Bio", content:
            <ProfilePageBio
                initialText={bioText}
                onSubmit={handleBioChange}
            />
        },
    ];
    */
    return (
        <></>
    );
}
export default CompanyTab;