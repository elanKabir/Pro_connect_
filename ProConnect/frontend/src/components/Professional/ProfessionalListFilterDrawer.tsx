import { Drawer, Grid } from '@mui/material';
import React from 'react';
import ProfessionalFilterSideBar from './ProfessionalFilterSideBar';

/**
 * A drawer component that displays a filter sidebar for the professional list.
 * @param {object} props - The props object containing the following properties:
 * @param {boolean} props.open - A boolean indicating whether the drawer is open or not.
 * @param {function} props.setOpen - A function to set the open state of the drawer.
 * @param {string} props.filterProfessionalSkills - A string representing the selected professional skills filter.
 * @param {function} props.setFilterProfessionalSkillsFn - A function to set the selected professional skills filter.
 * @param {string[]} props.filterProfessionalLocation - An array of strings representing the selected professional location filter.
 * @param {function} props.setFilterProfessionalLocationFn - A function to set the selected professional location filter.
 * @param {string[]} props.filterProfessionalRating - An array of strings representing the selected professional rating filter.
 * @param {function} props.setFilterProfessionalRatingFn - A function to set the selected professional rating filter.
 * @param {string[]} props.sortProfessionalRatingBy - An array of strings representing the selected professional rating sorting option.
 * @param {function} props.setSortProfessionalRatingByFn - A function to set the selected professional rating sorting option.
 * @returns {JSX.Element} A JSX element representing the professional list filter drawer.
 */
const ProfessionalListFilterDrawer = (props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
            <ProfessionalFilterSideBar
              handleCloseFn={handleClose}
              filterProfessionalSkills={props.filterProfessionalSkills}
              filterProfessionalLocation={props.filterProfessionalLocation}
              filterProfessionalRating={props.filterProfessionalRating}
              setFilterProfessionalLocationFn={
                props.setFilterProfessionalLocationFn
              }
              setFilterProfessionalRatingFn={
                props.setFilterProfessionalRatingFn
              }
              sortProfessionalRatingBy={props.sortProfessionalRatingBy}
              setFilterProfessionalSkillsFn={
                props.setFilterProfessionalSkillsFn
              }
              setSortProfessionalRatingByFn={
                props.setSortProfessionalRatingByFn
              }
            />
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default ProfessionalListFilterDrawer;
