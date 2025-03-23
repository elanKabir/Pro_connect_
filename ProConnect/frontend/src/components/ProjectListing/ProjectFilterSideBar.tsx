import { Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import DropdownMenuWithSelect from '../Textfield/DropdownMenuWithSelect';
import CloseIcon from '@mui/icons-material/Close';
import {
  projectStatusDataSet,
  skillsDataSet,
  sortByDataSet,
  typeOfProjectDataSet,
  workLocationDataSet,
} from './Data';

/**
 * A component that displays a filter sidebar for projects.
 * @param {Object} props - The props object.
 * @param {Function} props.handleCloseFn - A function to close the sidebar.
 * @param {string[]} props.filterProjectType - An array of selected project types to filter by.
 * @param {Function} props.setFilterProjectTypeFn - A function to set the selected project types to filter by.
 * @param {string[]} props.filterProjectCategory - An array of selected project categories to filter by.
 * @param {Function} props.setFilterProjectCategoryFn - A function to set the selected project categories to filter by.
 * @param {string[]} props.filterProjectLocation - An array of selected project locations to filter by.
 * @param {Function} props.setFilterProjectLocationFn - A function to set the selected project locations to filter by.
 * @param {string[]} props.sortProjectBy - An array of selected project sorting options.
 * @param {Function} props.setSortProjectByFn - A function to set the selected project sorting options.
 * @param {string[]} props.filterProjectStatus - An array of selected project statuses to filter by.
 * @param {Function} props.setFilterProjectStatusFn - A function to set the selected project statuses to filter by.
 * @returns {JSX.Element} A JSX element that displays the filter sidebar.
 */
const ProjectFilterSideBar = (props: {
  handleCloseFn: () => void;
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
  return (
    <>
      <Grid container spacing={2}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          marginTop={2}
          marginLeft={2}
          marginRight={-2}
        >
          <Grid item sm={12} marginLeft={1} xs={9}>
            <Typography variant="h5">Filters</Typography>
          </Grid>

          <Grid
            item
            xs={1.5}
            sx={{
              display: { xs: 'block', sm: 'none' },
            }}
          >
            <IconButton size="small" onClick={props.handleCloseFn}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Project Type'}
            options={typeOfProjectDataSet}
            selectedOptions={props.filterProjectType}
            setSelectedOptions={props.setFilterProjectTypeFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Category'}
            options={skillsDataSet}
            selectedOptions={props.filterProjectCategory}
            setSelectedOptions={props.setFilterProjectCategoryFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Location'}
            options={workLocationDataSet}
            selectedOptions={props.filterProjectLocation}
            setSelectedOptions={props.setFilterProjectLocationFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Status'}
            options={projectStatusDataSet}
            selectedOptions={props.filterProjectStatus}
            setSelectedOptions={props.setFilterProjectStatusFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Sort by'}
            options={sortByDataSet}
            selectedOptions={props.sortProjectBy}
            setSelectedOptions={props.setSortProjectByFn}
            multiple={false}
          ></DropdownMenuWithSelect>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectFilterSideBar;
