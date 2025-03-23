import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';

import ProjectCard from './ProjectCard';


interface ProjectPaginationProps {
  projects: Project[]
}
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


const ProjectPagination: React.FC<ProjectPaginationProps> = ({ projects }) => {


  if (projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <></>
        {/* Adjust the above line to match your ProjectCard component's props */}
      </Box>
    );
  }

  return (
    <>
      <Grid container direction="column" spacing={5}>
        <Grid item md={8} sm={9} lg={9} xl={10} xs={12}>
          <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {projects.map((project, index) => (
              <ProjectCard key={project.projectID}
                title={project.title}
                description={project.description}
                dateCreated={project.dateCreated}
                projectOwner={project.projectOwner}
                projectID={project.projectID}
                status={project.status}
                professionals={project.professionals}
                projectType={project.projectType}
                projectLocation={project.projectLocation}
                projectCategory={project.projectCategory}
              />))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}


export default ProjectPagination
