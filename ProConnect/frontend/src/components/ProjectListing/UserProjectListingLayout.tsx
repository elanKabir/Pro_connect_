import React from 'react';
import IndividualProjectListingTable from './IndividualProjectListingTable';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import ProjectFilterSideBar from './ProjectFilterSideBar';

/**
 * A layout component for displaying a user's project listing.
 * @param headers - An array of strings representing the table headers.
 * @param dataRows - An array of objects representing the data rows of the table.
 * @param search - A string representing the current search query.
 * @param setSearchFn - A function to update the search query.
 * @param filterProjectType - An array of strings representing the selected project types for filtering.
 * @param setFilterProjectTypeFn - A function to update the selected project types for filtering.
 * @param filterProjectCategory - An array of strings representing the selected project categories for filtering.
 * @param setFilterProjectCategoryFn - A function to update the selected project categories for filtering.
 * @param filterProjectLocation - An array of strings representing the selected project locations for filtering.
 * @param setFilterProjectLocationFn - A function to update the selected project locations for filtering.
 * @param sortProjectBy - An array of strings representing the selected sorting options for the table.
 * @param setSortProjectByFn - A function to update the selected sorting options for the table.
 * @param filterProjectStatus - An array of strings representing the selected project statuses for filtering.
 * @param setFilterProjectStatusFn - A function to update the selected project statuses for filtering.
 * @returns A React component for displaying a user's project listing.
 */
const UserProjectListingLayout = (props: {
  headers: string[];
  dataRows: any[];
  search: string;
  setSearchFn: React.Dispatch<React.SetStateAction<string>>;
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
    <Grid container direction="row" spacing={5}>
      <Grid item sm={11} xs={10} md={12}>
        <TextField
          label="Search"
          fullWidth
          size="small"
          value={props.search}
          onChange={(event) => {
            props.setSearchFn(event.target.value);
          }}
        />
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: {
            xs: 'block',
            sm: 'block',
            md: 'none',
          },
        }}
      >
        <Tooltip title="Filter">
          <IconButton onClick={() => {}} aria-label="Filter">
            <FilterList />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid
        item
        md={4}
        lg={3}
        xl={2}
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'block',
          },
        }}
      >
        <ProjectFilterSideBar
          handleCloseFn={() => {}}
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
      <Grid item md={8} lg={9} xl={10} xs={12}>
        <IndividualProjectListingTable
          headers={props.headers}
          dataRows={props.dataRows}
          tableName="Projects"
          loading={false}
        />
      </Grid>
    </Grid>
  );
};

export default UserProjectListingLayout;
