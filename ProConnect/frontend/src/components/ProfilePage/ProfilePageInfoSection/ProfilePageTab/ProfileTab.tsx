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
import { ProfilePageObject, ProjectData, ProjectsData, ReviewData, Reviews, Setters } from '../../../../apis/types';
import CV from '../../CV';
import ReviewsGrid from '../../FeaturedReviews';

interface ProfileTabProps {
    tabLabels?: string[];
    ProfilePageObject: ProfilePageObject
    Setters: Setters
    user_id: string | undefined | null;
    allReviews: ReviewData[]
}
type TabData = {
    label: string;
    content: JSX.Element;
};
type Project = {
    title: string;
    description: string;
    dateCreated: string;
    projectOwner: string;
    projectID: string;
    status: string;
    professionals: string;
    projectType: string;
    projectLocation: string;
    projectCategory: string;
}




const ProfileTab: React.FC<ProfileTabProps> = ({ ProfilePageObject, Setters, user_id, allReviews }) => {
    const [allProjects, setAllProject] = React.useState<Project[]>([]);


    const getProjectStats = (data: [any]) => {
        const filterStatuses = new Set(["ongoing", "completed", "open"]);
        const allProjects = data
        const projects = data.filter(project =>
            filterStatuses.has(project.status.toLowerCase())
        );

        const sortedProjects = projects.sort((a, b) => new Date(b.project_date_created).getTime() - new Date(a.project_date_created).getTime());
        const recentProjects = sortedProjects.slice(0, 6);
        const projectCardFormat: Project[] = projects.map(projectData => formatData(projectData))
        setAllProject(projectCardFormat)
        console.log(projectCardFormat)
    }
    function formatData(projectData: any): Project {
        return {
            title: projectData.title,
            description: projectData.description,
            dateCreated: projectData.date_created,
            projectOwner: projectData.project_owner_name,
            projectID: projectData._id.$oid,
            status: projectData.status,
            professionals: projectData.professional_num,
            projectType: projectData.project_type,
            projectLocation: projectData.location,
            projectCategory: projectData.category,
        }
    }

    useEffect(() => {
        makeRequestFn('/view_profile_projectlist?user_id=' + user_id, 'GET', undefined, ProfilePageObject.token, getProjectStats);
    }, [ProfilePageObject.token]);

    const tabsData = [
        {
            label: "Recent Projects",
            content: allProjects.length === 0 ? (
                <Typography variant='h6'>No Projects</Typography>
            ) : (
                <ProjectPagination projects={allProjects} />
            )
        },
        {
            label: "Reviews", content:
                allProjects.length === 0 ? (
                    <Typography variant='h6'>No Reviews</Typography>
                ) : (
                    <ReviewsGrid reviews={allReviews} />
                )
        },

    ];
    // Conditionally include additional tabs based on the user's role'
    let conditionalTabsData: TabData[] = []


    if (ProfilePageObject.userDetails.role === '30') {
        conditionalTabsData = [...tabsData,
        {
            label: "Skills",
            content: <SkillsInput ProfilePageObject={ProfilePageObject} Setters={Setters} />
        },
        {
            label: "CV", content: <CV ProfilePageObject={ProfilePageObject} Setters={Setters} />
        }
        ];
    } else if (ProfilePageObject.userDetails.role === '20') {
        conditionalTabsData = [
            ...tabsData,
            {
                label: "Bio",
                content: <ProfilePageBio initialText={ProfilePageObject.userDetails.company_bio || " "} ProfilePageObject={ProfilePageObject} Setters={Setters} />
            },
        ];
    }
    return (
        <Box>
            <BasicTab tabs={conditionalTabsData} />
        </Box>
    );
}
export default ProfileTab;
