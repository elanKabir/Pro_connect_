import React from 'react';
import MakePage from '../components/MakePage';
import CompanyPageProjectListingLayout from '../components/ProjectListing/UserProjectListingLayout';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import PageviewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import { BACKEND_API_URL } from '../apis/config';
import { IconButton, Link } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const API_PROJECT_LISTINGS_URL = BACKEND_API_URL + '/view_my_projectlist';

/**
 * Renders a page that displays the projects of a user.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - A function to set the authentication token.
 * @param {string} props.token - The authentication token.
 * @returns {JSX.Element} - The rendered component.
 */
const UserProjectPage = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { uid } = useParams<{ uid: string }>();
  const decodedToken: any = jwtDecode(props.token!);
  const userRole: string = decodedToken.role;
  const navigate = useNavigate();
  const [search, setSearch] = React.useState<string>('');
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

  const [projectRows, setProjectRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    axios
      .get(API_PROJECT_LISTINGS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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
        setProjectRows(
          response.data.data.map((project: any) => ({
            id: project._id.$oid.toString(),
            project: project.title.toUpperCase(),
            posted_date: project.date_created,
            deadline: project.deadline,
            status: project.status.toUpperCase(),
            applications: (
              <Link
                component={'button'}
                variant="body2"
                onClick={() => {
                  navigate(
                    `/project/${project._id.$oid.toString()}/applicants`
                  );
                }}
              >
                Applicants
              </Link>
            ),
            team: project.approved_users ? <a href="/">Team</a> : null,
            joined_date: project.approved_users
              ? project.approved_users.map((user: any) =>
                  user.user_id === uid ? user.date_joined : null
                )
              : null,
            actions: (
              <>
                <IconButton
                  size="small"
                  onClick={() => {
                    navigate(`/project/${project._id.$oid.toString()}`);
                  }}
                >
                  <PageviewIcon />
                </IconButton>
                {project.status === 'open' && project.owner !== uid ? (
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigate(
                        `/project/${project._id.$oid.toString()}/edit_project`
                      );
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : null}
              </>
            ),
          }))
        );
      })
      .catch((error) => {
        toast.error(error.response);
      });
  }, [
    search,
    filterProjectType,
    filterProjectLocation,
    filterProjectCategory,
    sortProjectBy,
    filterProjectStatus,
    uid,
    navigate,
  ]);

  const companyPageProjectListHeaders = [
    'Project',
    'Posted Date',
    'Deadline',
    'Status',
    'Applications',
    'Actions',
  ];

  const professionalPageProjectListHeaders = [
    'Project',
    'Joined Date',
    'Deadline',
    'Status',
    'Team',
    'Actions',
  ];

  return (
    <MakePage
      setTokenHandler={props.setTokenHandler}
      token={props.token}
      pageTitle="My Projects"
      pageElement={
        <CompanyPageProjectListingLayout
          headers={
            userRole === '20'
              ? companyPageProjectListHeaders
              : professionalPageProjectListHeaders
          }
          dataRows={projectRows}
          search={search}
          setSearchFn={setSearch}
          filterProjectType={filterProjectType}
          setFilterProjectTypeFn={setFilterProjectType}
          filterProjectCategory={filterProjectCategory}
          setFilterProjectCategoryFn={setFilterProjectCategory}
          filterProjectLocation={filterProjectLocation}
          setFilterProjectLocationFn={setFilterProjectLocation}
          sortProjectBy={sortProjectBy}
          setSortProjectByFn={setSortProjectBy}
          filterProjectStatus={filterProjectStatus}
          setFilterProjectStatusFn={setFilterProjectStatus}
        />
      }
    />
  );
};

export default UserProjectPage;
