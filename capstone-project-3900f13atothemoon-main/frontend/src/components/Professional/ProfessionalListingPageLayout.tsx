import React from 'react';
import ProfessionalListFilterDrawer from './ProfessionalListFilterDrawer';
import ProfessionalFilterSideBar from './ProfessionalFilterSideBar';
import {
  Box,
  Grid,
  IconButton,
  Pagination,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfessionalListingCard from './ProfessionalListingCard';

const API_PROFESSIONAL_LISTING = BACKEND_API_URL + '/professionals/all';
const PROFESSIONAL_PER_PAGE = 5;

type professionalData = {
  avatarURL: string | null;
  name: string;
  bio: string;
  location: string;
  rating: number;
  recommended: boolean;
  id: string;
};

/**
 * Renders the layout for the professional listing page, including search bar, filter sidebar, and professional cards.
 * @returns A React component that displays the professional listing page layout.
 */
const ProfessionalListingPageLayout = () => {
  const [search, setSearch] = React.useState<string>('');

  const [professionalRows, setProfessionalRows] = React.useState<
    professionalData[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [filterProfessionalSkills, setFilterProfessionalSkills] =
    React.useState<string>('');
  const [filterProfessionalLocation, setFilterProfessionalLocation] =
    React.useState<string[]>([]);
  const [filterProfessionalRating, setFilterProfessionalRating] =
    React.useState<string[]>([]);
  const [sortProfessionalRatingBy, setSortProfessionalRatingBy] =
    React.useState<string[]>(['Highest Rated']);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  React.useEffect(() => {
    axios
      .get(API_PROFESSIONAL_LISTING, {
        params: {
          query: search === '' ? null : search,
          skills:
            filterProfessionalSkills === ''
              ? null
              : filterProfessionalSkills.toLowerCase(),
          location:
            filterProfessionalLocation.length === 0
              ? null
              : filterProfessionalLocation.map((location) => {
                  if (location === 'New South Wales') {
                    return 'NSW';
                  } else if (location === 'Victoria') {
                    return 'VIC';
                  } else if (location === 'Queensland') {
                    return 'QLD';
                  } else if (location === 'Western Australia') {
                    return 'WA';
                  } else if (location === 'South Australia') {
                    return 'SA';
                  } else if (location === 'Tasmania') {
                    return 'TAS';
                  } else if (location === 'Australian Capital Territory') {
                    return 'ACT';
                  } else if (location === 'Northern Territory') {
                    return 'NT';
                  } else {
                    return location;
                  }
                }),
          rating:
            filterProfessionalRating.length === 0
              ? null
              : filterProfessionalRating.map((rating) => {
                  if (rating === '5 Stars') {
                    return 5;
                  } else if (rating === '4 Stars') {
                    return 4;
                  } else if (rating === '3 Stars') {
                    return 3;
                  } else if (rating === '2 Stars') {
                    return 2;
                  } else if (rating === '1 Star') {
                    return 1;
                  } else {
                    return 0;
                  }
                }),
          sort_by:
            sortProfessionalRatingBy.length === 0
              ? null
              : sortProfessionalRatingBy[0],
        },
        paramsSerializer: { indexes: null },
      })
      .then((response) => {
        const data = response.data.data;
        const professionalData: professionalData[] = data.map(
          (professional: any) => ({
            avatarURL: professional.profile_image
              ? professional.profile_image
              : null,
            name: professional.entityname,
            bio: professional.bio ? professional.bio : '',
            location: professional.location,
            rating: professional.rating ? professional.rating : 0,
            recommended: professional.boosted ? professional.boosted : false,
            id: professional._id.$oid,
          })
        );
        setProfessionalRows(professionalData);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [
    filterProfessionalLocation,
    filterProfessionalRating,
    filterProfessionalSkills,
    search,
    sortProfessionalRatingBy,
  ]);

  return (
    <>
      <Grid container direction="row" spacing={5}>
        <Grid item sm={12} xs={10}>
          <TextField
            label="Search"
            fullWidth
            size="small"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: {
              xs: 'block',
              sm: 'none',
              md: 'none',
            },
          }}
        >
          <Tooltip title="Filter">
            <IconButton onClick={handleFilterClick} aria-label="Filter">
              <FilterList />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid
          item
          md={4}
          sm={3}
          lg={3}
          xl={2}
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
              md: 'block',
            },
          }}
        >
          <ProfessionalFilterSideBar
            handleCloseFn={() => {}}
            filterProfessionalSkills={filterProfessionalSkills}
            setFilterProfessionalSkillsFn={setFilterProfessionalSkills}
            filterProfessionalLocation={filterProfessionalLocation}
            setFilterProfessionalLocationFn={setFilterProfessionalLocation}
            filterProfessionalRating={filterProfessionalRating}
            setFilterProfessionalRatingFn={setFilterProfessionalRating}
            sortProfessionalRatingBy={sortProfessionalRatingBy}
            setSortProfessionalRatingByFn={setSortProfessionalRatingBy}
          />
        </Grid>
        <Grid item md={8} sm={9} lg={9} xl={10} xs={12}>
          <Grid container spacing={2}>
            {loading ? (
              <>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              </>
            ) : professionalRows.length > 0 ? (
              professionalRows
                ?.slice(
                  (currentPage - 1) * PROFESSIONAL_PER_PAGE,
                  currentPage * PROFESSIONAL_PER_PAGE
                )
                .map((professional) => (
                  <Grid item xs={12} key={professional.id}>
                    <ProfessionalListingCard
                      key={professional.id}
                      id={professional.id}
                      avatarURL={professional.avatarURL}
                      name={professional.name}
                      bio={professional.bio}
                      location={professional.location}
                      rating={professional.rating}
                      recommended={professional.recommended}
                    />
                  </Grid>
                ))
            ) : (
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Typography variant="h6">No professionals available</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      {professionalRows.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(professionalRows.length / PROFESSIONAL_PER_PAGE)}
            page={currentPage}
            onChange={(event: React.ChangeEvent<unknown>, value: number) =>
              handlePageChange(
                event as React.MouseEvent<HTMLButtonElement>,
                value
              )
            }
          />
        </Box>
      )}

      <ProfessionalListFilterDrawer
        open={filterOpen}
        setOpen={setFilterOpen}
        filterProfessionalSkills={filterProfessionalSkills}
        setFilterProfessionalSkillsFn={setFilterProfessionalSkills}
        filterProfessionalLocation={filterProfessionalLocation}
        setFilterProfessionalLocationFn={setFilterProfessionalLocation}
        filterProfessionalRating={filterProfessionalRating}
        setFilterProfessionalRatingFn={setFilterProfessionalRating}
        sortProfessionalRatingBy={sortProfessionalRatingBy}
        setSortProfessionalRatingByFn={setSortProfessionalRatingBy}
      />
    </>
  );
};

export default ProfessionalListingPageLayout;
