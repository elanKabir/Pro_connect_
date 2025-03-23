import React from 'react';
import IndividualProjectListingTable from '../ProjectListing/IndividualProjectListingTable';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Grid, Link } from '@mui/material';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const API_APPLICANTS_URL = BACKEND_API_URL + '/applied_user_list';
const API_APPROVE_URL = BACKEND_API_URL + '/approve_user';
const API_REJECT_URL = BACKEND_API_URL + '/reject_user';

const dataHeaders = ['Name', 'Email', 'Proposal', 'Actions'];

const ProjectApplicantsLayout = () => {
  const [dataRow, setDataRow] = React.useState<any[]>([]);
  const [dataloading, setDataLoading] = React.useState<boolean>(true);
  const [userApprovedLoading, setUserApprovedLoading] =
    React.useState<boolean>(false);
  const [userRejectLoading, setUserRejectLoading] =
    React.useState<boolean>(false);

  const navigate = useNavigate();

  let { project_id } = useParams<{ project_id: string }>();

  React.useEffect(() => {
    const handleApprove = (id: string, name: string) => {
      setUserApprovedLoading(true);
      axios
        .post(
          API_APPROVE_URL,
          {
            project_id: project_id,
            approve_uid: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          toast.success(`Successfully approved ${name}! for the project.`);
        })
        .catch((error) => {
          toast.error(`Failed to approve ${name}! for the project.`);
        })
        .finally(() => {
          setUserApprovedLoading(false);
        });
    };

    const handleReject = (id: string, name: string) => {
      setUserRejectLoading(true);
      axios
        .delete(API_REJECT_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            project_id: project_id,
            reject_id: id,
          },
        })
        .then((response) => {
          toast.success(`Successfully rejected ${name}! for the project.`);
        })
        .catch((error) => {
          toast.error(`Failed to reject ${name}! for the project.`);
        })
        .finally(() => {
          setTimeout(() => {
            setUserApprovedLoading(false);
          }, 30000);
          setUserRejectLoading(false);
        });
    };

    axios
      .get(API_APPLICANTS_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          project_id: project_id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setDataRow(
          data.map((applicant: any) => ({
            id: applicant.user_id,
            name: (
              <Link
                component={'button'}
                variant="body2"
                onClick={() => {
                  navigate(`/profile/${applicant.user_id}`);
                }}
              >
                {applicant.name}
              </Link>
            ),
            email: (
              <Link
                component={'button'}
                variant="body2"
                onClick={(event) => {
                  window.location.href = `mailto:${applicant.email}`;
                  event.preventDefault();
                }}
              >
                {applicant.email}
              </Link>
            ),
            // TODO: Add a proposal screen
            proposal: (
              <Link
                component={'button'}
                variant="body2"
                onClick={() => {
                  navigate(
                    '/project/' +
                      project_id +
                      '/applicants/' +
                      applicant.user_id
                  );
                }}
              >
                View Proposal
              </Link>
            ),
            actions: (
              <>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={userApprovedLoading}
                  onClick={() => {
                    handleApprove(applicant.user_id, applicant.name);
                  }}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  Approve
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={userRejectLoading}
                  onClick={() => {
                    handleReject(applicant.user_id, applicant.name);
                  }}
                  size="small"
                >
                  Decline
                </LoadingButton>
              </>
            ),
          }))
        );
        setDataLoading(false);
      });
  }, [project_id, navigate, userApprovedLoading, userRejectLoading]);

  return (
    <IndividualProjectListingTable
      headers={dataHeaders}
      dataRows={dataRow}
      tableName="Applications"
      loading={dataloading}
    />
  );
};

export default ProjectApplicantsLayout;
