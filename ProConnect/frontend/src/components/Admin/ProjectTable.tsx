import React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Link } from '@mui/material';

import PageviewIcon from '@mui/icons-material/Pageview';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';
import ConfirmationDialog from '../ConfirmationDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const API_VIEWPROJECT_URL = `${BACKEND_API_URL}/v1/admin/project`;
const API_DELETEUSER_URL = `${BACKEND_API_URL}/delete_project`;

type projectData = {
  id: string;
  projectTitle: string;
  projectOwner: string;
  projectType: string;
  projectStatus: string;
  projectCategory: string;
  projectDateCreated: string;
};

/**
 * A table component that displays project data for an admin user.
 * @param {Object} props - The props object that contains the token for authentication.
 * @returns {JSX.Element} - A table component that displays project data.
 */
const ProjectTable = (props: { token: string | null }) => {
  const [projectRows, setProjectRows] = React.useState<projectData[]>([]);
  const [projectDeleteState, setProjectDelete] = React.useState<string>('');
  const [projectDeleteDialog, setProjectDeleteDialog] =
    React.useState<boolean>(false);

  const navigate = useNavigate();
  const viewProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };
  const deleteProject = (id: string) => {
    setProjectDelete(id);
    setProjectDeleteDialog(true);
  };

  const onConfirmDeleteProject = (id: string) => {
    axios
      .delete(API_DELETEUSER_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
        params: {
          project_id: id,
        },
      })
      .then(() => {
        setProjectDeleteDialog(false);
        toast.success(`Project ${id} deleted`);
        setProjectDelete('');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Project ID',
      width: 0,
    },
    {
      field: 'projectDateCreated',
      headerName: 'Date Created',
      minWidth: 100,
      type: 'date',
    },
    {
      field: 'projectOwner',
      headerName: 'Owner',
      minWidth: 250,
      flex: 1,
    },
    {
      field: 'projectTitle',
      headerName: 'Title',
      minWidth: 300,
      flex: 1,
    },

    {
      field: 'projectCategory',
      headerName: 'Category',
      minWidth: 200,
    },
    {
      field: 'projectStatus',
      headerName: 'Status',
      minWidth: 120,
    },
    {
      field: 'projectType',
      headerName: 'Type',
      minWidth: 110,
    },
    {
      field: 'projectApplicants',
      headerName: 'Applicants',
      minWidth: 110,
      renderCell({ id }) {
        return <Link href={`/project/${id}/applicants`}>Applicants</Link>;
      },
    },
    {
      field: 'projectTeam',
      headerName: 'Team',
      minWidth: 110,
      renderCell({ id }) {
        return <Link href={`/project/${id}`}>Team</Link>;
      },
    },
    {
      field: 'entityAction',
      headerName: 'Action',
      type: 'actions',
      minWidth: 75,
      getActions({ id }) {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="More Actions"
            aria-label="more actions"
            onClick={() => {
              deleteProject(id.toString());
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<PageviewIcon />}
            label="More Actions"
            aria-label="more actions"
            onClick={() => {
              viewProjectDetails(id.toString());
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // Renders the users table on page load and when userDeleteState changes
  React.useEffect(() => {
    axios
      .get(API_VIEWPROJECT_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const rows: projectData[] = data.map((project: any) => ({
          id: project._id.$oid,
          projectTitle: project.title,
          projectOwner: project.project_owner_name,
          projectType: project.project_type.toUpperCase(),
          projectStatus: project.status.toUpperCase(),
          projectCategory: project.category,
          projectDateCreated: new Date(project.date_created),
        }));
        setProjectRows(rows);
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error.response.data.message);
      });
  }, [projectDeleteState, props.token]);
  return (
    <>
      <Box sx={{ height: '100%', width: '100%', display: 'grid' }}>
        <DataGrid
          rows={projectRows}
          columnVisibilityModel={{
            id: false,
          }}
          columns={columns}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
        />
        <ConfirmationDialog
          openStatus={projectDeleteDialog}
          onClose={() => {
            setProjectDeleteDialog(false);
          }}
          title="Delete User"
          content={`Are you sure you want to delete project ${projectDeleteState}? This action cannot be undone.`}
          cancelButton="Cancel"
          confirmButton="Delete"
          actionFn={() => {
            onConfirmDeleteProject(projectDeleteState);
            setProjectDeleteDialog(false);
            setProjectDelete('');
          }}
        />
      </Box>
    </>
  );
};

export default ProjectTable;
