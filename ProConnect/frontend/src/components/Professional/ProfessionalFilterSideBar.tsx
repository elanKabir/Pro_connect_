import { Grid, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import DropdownMenuWithSelect from '../Textfield/DropdownMenuWithSelect';
import CloseIcon from '@mui/icons-material/Close';
import {
  ProfessionalLocation,
  ProfessionalRatings,
  ProfessionalSortBy,
} from './data';

/**
 * A component that displays a sidebar with filters for professionals.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.handleCloseFn - The function to close the sidebar.
 * @param {string} props.filterProfessionalSkills - The value of the skills filter.
 * @param {Function} props.setFilterProfessionalSkillsFn - The function to set the value of the skills filter.
 * @param {string[]} props.filterProfessionalLocation - The selected options of the location filter.
 * @param {Function} props.setFilterProfessionalLocationFn - The function to set the selected options of the location filter.
 * @param {string[]} props.filterProfessionalRating - The selected options of the rating filter.
 * @param {Function} props.setFilterProfessionalRatingFn - The function to set the selected options of the rating filter.
 * @param {string[]} props.sortProfessionalRatingBy - The selected option of the sort by filter.
 * @param {Function} props.setSortProfessionalRatingByFn - The function to set the selected option of the sort by filter.
 * @returns {JSX.Element} The ProfessionalFilterSideBar component.
 */
const ProfessionalFilterSideBar = (props: {
  handleCloseFn: () => void;
  filterProfessionalSkills: string;
  setFilterProfessionalSkillsFn: React.Dispatch<React.SetStateAction<string>>;
  filterProfessionalLocation: string[];
  setFilterProfessionalLocationFn: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  filterProfessionalRating: string[];
  setFilterProfessionalRatingFn: React.Dispatch<React.SetStateAction<string[]>>;
  sortProfessionalRatingBy: string[];
  setSortProfessionalRatingByFn: React.Dispatch<React.SetStateAction<string[]>>;
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
              display: { xs: 'block', sm: 'none' }, // add this line to align to end
            }}
          >
            <IconButton size="small" onClick={props.handleCloseFn}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <TextField
            sx={{ m: 1 }}
            label="Skills"
            value={props.filterProfessionalSkills}
            onChange={(event) => {
              props.setFilterProfessionalSkillsFn(event.target.value);
            }}
            fullWidth
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Location'}
            options={ProfessionalLocation}
            selectedOptions={props.filterProfessionalLocation}
            setSelectedOptions={props.setFilterProfessionalLocationFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Rating'}
            options={ProfessionalRatings}
            selectedOptions={props.filterProfessionalRating}
            setSelectedOptions={props.setFilterProfessionalRatingFn}
            multiple={true}
          />
        </Grid>

        <Grid item sm={12} md={12} xs={12}>
          <DropdownMenuWithSelect
            label={'Sort by'}
            options={ProfessionalSortBy}
            selectedOptions={props.sortProfessionalRatingBy}
            setSelectedOptions={props.setSortProfessionalRatingByFn}
            multiple={false}
          ></DropdownMenuWithSelect>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfessionalFilterSideBar;
