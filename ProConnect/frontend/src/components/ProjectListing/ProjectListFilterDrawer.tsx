import { Drawer, Grid } from '@mui/material';

import React from 'react';
import ProjectFilterSideBar from './ProjectFilterSideBar';

/**
 * Renders a drawer component that contains a project filter sidebar.
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the drawer is open or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setOpen - Function to set the state of the drawer.
 * @param {string[]} props.filterProjectType - Array of project types to filter by.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setFilterProjectTypeFn - Function to set the state of the project type filter.
 * @param {string[]} props.filterProjectCategory - Array of project categories to filter by.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setFilterProjectCategoryFn - Function to set the state of the project category filter.
 * @param {string[]} props.filterProjectLocation - Array of project locations to filter by.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setFilterProjectLocationFn - Function to set the state of the project location filter.
 * @param {string[]} props.sortProjectBy - Array of project sorting options.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setSortProjectByFn - Function to set the state of the project sorting option.
 * @param {string[]} props.filterProjectStatus - Array of project statuses to filter by.
 * @param {React.Dispatch<React.SetStateAction<string[]>>} props.setFilterProjectStatusFn - Function to set the state of the project status filter.
 * @returns {JSX.Element} - The ProjectListFilterDrawer component.
 */
const ProjectListFilterDrawer = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterProjectType: string[];
  setFilterProjectTypeFn: React.Dispatch<React.SetStateAction<string[]>>;
  filterProjectCategory: string[];
  setFilterProjectCategoryFn: React.Dispatch<React.SetStateAction<string[]>>;
  filterProjectLocation: string[];
  setFilterProjectLocationFn: React.Dispatch<React.SetStateAction<string[]>>;
  sortProjectBy: string[];
  setSortProjectByFn: React.Dispatch<React.SetStateAction<string[]>>;
  filterProjectStatus: string[];
  setFilterProjectStatusFn: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={props.open}
        onClose={handleClose}
        PaperProps={{ sx: { width: '65%', maxWidth: 360 } }}
      >
        <Grid container>
          <Grid item sx={{ marginRight: 4, marginTop: 2 }}>
            <ProjectFilterSideBar
              handleCloseFn={handleClose}
              filterProjectType={props.filterProjectType}
              filterProjectLocation={props.filterProjectLocation}
              filterProjectCategory={props.filterProjectCategory}
              sortProjectBy={props.sortProjectBy}
              setFilterProjectTypeFn={props.setFilterProjectTypeFn}
              setFilterProjectLocationFn={props.setFilterProjectLocationFn}
              setFilterProjectCategoryFn={props.setFilterProjectCategoryFn}
              setSortProjectByFn={props.setSortProjectByFn}
              filterProjectStatus={props.filterProjectStatus}
              setFilterProjectStatusFn={props.setFilterProjectStatusFn}
            />
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default ProjectListFilterDrawer;
