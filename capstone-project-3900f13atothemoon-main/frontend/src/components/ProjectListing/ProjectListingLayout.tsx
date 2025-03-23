import React from 'react';
import ProjectFilterSideBar from './ProjectFilterSideBar';
import ProjectCard from './ProjectCard';
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
import FilterList from '@mui/icons-material/FilterList';
import ProjectListFilterDrawer from './ProjectListFilterDrawer';
import axios from 'axios';
import jwt from 'jwt-decode';
import { BACKEND_API_URL } from '../../apis/config';

type projectData = {
  title: string;
  description: string;
  category: string;
  date_created: string;
  project_owner: string;
  project_owner_name: string;
  project_id: string;
  professionals: string;
  status: string;
  project_type: string;
  location: string;
  recommended: boolean;
};

type User = {
  uid: string;
  email: string;
  entityname: string;
  abn: string;
  role: string;
};

const API_PROJECT_LISTINGS_URL = BACKEND_API_URL + '/browse_all_projects';
const PROJECTS_PER_PAGE = 4;

const ProjectListingLayout = () => {
  const [search, setSearch] = React.useState<string>('');

  const [projectRows, setProjectRows] = React.useState<projectData[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const [filterProjectType, setFilterProjectType] = React.useState<string[]>(
    []
  );
  const [filterProjectLocation, setFilterProjectLocation] = React.useState<
    string[]
  >([]);
  const [filterProjectCategory, setFilterProjectCategory] = React.useState<
    string[]
  >([]);
  const [sortProjectBy, setSortProjectBy] = React.useState<string[]>([
    'Newest',
  ]);
  const [filterProjectStatus, setFilterProjectStatus] = React.useState<
    string[]
  >([]);

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  try {
    var user: User = jwt(localStorage.getItem('token')!);
  } catch (error) {
    user = {
      uid: 'null',
      email: 'null',
      entityname: 'null',
      abn: 'null',
      role: 'null',
    };
  }

  React.useEffect(() => {
    axios
      .get(API_PROJECT_LISTINGS_URL, {
        params: {
          query: search === '' ? null : search,

          project_type:
            filterProjectType.length === 0 ? null : filterProjectType,
          project_category:
            filterProjectCategory.length === 0 ? null : filterProjectCategory,
          project_location:
            filterProjectLocation.length === 0 ? null : filterProjectLocation,
          project_status:
            filterProjectStatus.length === 0
              ? null
              : filterProjectStatus.map((status) => status.toLowerCase()),
          sortby: sortProjectBy[0] === 'Newest' ? null : sortProjectBy[0],
        },
        paramsSerializer: { indexes: null },
      })
      .then((response) => {
        const data = response.data.data;
        const projectData: projectData[] = data.map((project: any) => ({
          title: project.title,
          description: project.description,
          category: project.category,
          date_created: project.date_created,
          project_owner: project.project_owner,
          project_owner_name: project.project_owner_name,
          project_id: project._id.$oid,
          status: project.status,
          professionals: project.professional_num,
          project_type: project.project_type,
          location: project.location,
          recommended: project.boosted ? project.boosted : false,
        }));

        setProjectRows(projectData);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e.data);
      });
  }, [
    search,
    filterProjectType,
    filterProjectLocation,
    filterProjectCategory,
    sortProjectBy,
    filterProjectStatus,
  ]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: number
  ) => {
    setCurrentPage(value);
  };

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
          <ProjectFilterSideBar
            handleCloseFn={() => {}}
            filterProjectType={filterProjectType}
            filterProjectLocation={filterProjectLocation}
            filterProjectCategory={filterProjectCategory}
            sortProjectBy={sortProjectBy}
            setFilterProjectTypeFn={setFilterProjectType}
            setFilterProjectLocationFn={setFilterProjectLocation}
            setFilterProjectCategoryFn={setFilterProjectCategory}
            setSortProjectByFn={setSortProjectBy}
            filterProjectStatus={filterProjectStatus}
            setFilterProjectStatusFn={setFilterProjectStatus}
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
            ) : projectRows.length > 0 ? (
              projectRows
                ?.slice(
                  (currentPage - 1) * PROJECTS_PER_PAGE,
                  currentPage * PROJECTS_PER_PAGE
                )
                .map((project) => (
                  <ProjectCard
                    key={project.project_id}
                    title={project.title}
                    description={project.description}
                    dateCreated={project.date_created}
                    projectOwner={project.project_owner_name}
                    projectID={project.project_id}
                    status={project.status.toUpperCase()}
                    projectType={project.project_type}
                    projectLocation={project.location}
                    projectCategory={project.category}
                    professionals={project.professionals}
                    recommended={project.recommended}
                    isCompanyUser={user.role === '20'}
                  />
                ))
            ) : (
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Typography variant="h6">No projects available</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {projectRows.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(projectRows.length / PROJECTS_PER_PAGE)}
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

      <ProjectListFilterDrawer
        open={filterOpen}
        setOpen={setFilterOpen}
        filterProjectType={filterProjectType}
        filterProjectLocation={filterProjectLocation}
        filterProjectCategory={filterProjectCategory}
        sortProjectBy={sortProjectBy}
        setFilterProjectTypeFn={setFilterProjectType}
        setFilterProjectLocationFn={setFilterProjectLocation}
        setFilterProjectCategoryFn={setFilterProjectCategory}
        setSortProjectByFn={setSortProjectBy}
        filterProjectStatus={filterProjectStatus}
        setFilterProjectStatusFn={setFilterProjectStatus}
      />
    </>
  );
};

export default ProjectListingLayout;
