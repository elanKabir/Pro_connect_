import React from 'react';
import IndividualProjectListingTable from '../ProjectListing/IndividualProjectListingTable';
import axios from 'axios';
import { BACKEND_API_URL } from '../../apis/config';
import { toast } from 'react-toastify';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PROFESSIONAL_APPLICATIONS_URL = BACKEND_API_URL + '/v1/myapplication';
const applicationTableHeaders = [
  'Title',
  'Project Description',
  'Project Budget',
  'Project Deadline',
  'Project Status',
  'Status',
  'Action',
];

/**
 * Renders a table of professional applications for a user.
 * @param {Object} props - The props object.
 * @param {string | null} props.token - The user's authentication token.
 * @returns {JSX.Element} - The ProfessionalApplicationLayout component.
 */
const ProfessionalApplicationLayout = (props: { token: string | null }) => {
  const [applicationRows, setApplicationRows] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get(PROFESSIONAL_APPLICATIONS_URL, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const data = response.data.data;

        setApplicationRows(
          data.map((application: any) => {
            return {
              title: application.title,
              project_description: application.description,
              project_budget: '$' + application.budget,
              project_deadline: application.deadline,
              project_status: application.status.toUpperCase(),
              status: application.application_status.toUpperCase(),
              action: (
                <Link
                  component={'button'}
                  variant="body2"
                  hidden={application.application_status === 'rejected'}
                  onClick={() => {
                    navigate(
                      `/project/${application._id.$oid}/applicants/${application.enquired_user}`
                    );
                  }}
                >
                  Application
                </Link>
              ),
            };
          })
        );
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [props.token, navigate]);

  return (
    <IndividualProjectListingTable
      tableName={'Applications'}
      headers={applicationTableHeaders}
      dataRows={applicationRows}
      loading={false}
    />
  );
};

export default ProfessionalApplicationLayout;
