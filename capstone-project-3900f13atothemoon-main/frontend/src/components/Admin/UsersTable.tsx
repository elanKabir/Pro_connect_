import React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PageviewIcon from '@mui/icons-material/Pageview';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';
import ConfirmationDialog from '../ConfirmationDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const API_VIEWUSER_URL = `${BACKEND_API_URL}/v2/view_user`;
const API_DELETEUSER_URL = `${BACKEND_API_URL}/v2/delete_account`;

type userData = {
  uid: string;
  entityName: string;
  entityEmail: string;
  entityABN: string;
  userType: string;
};

/**
 * A table component that displays a list of users and allows for deleting and viewing user profiles.
 * @param {Object} props - The props object containing the user's token.
 * @param {string | null} props.token - The user's token.
 * @returns {JSX.Element} - The UsersTable component.
 */
const UsersTable = (props: { token: string | null }) => {
  const [userRows, setUserRows] = React.useState<userData[]>([]);
  const [userDeleteState, setUserDelete] = React.useState<string>('');
  const [userDeleteDialog, setUserDeleteDialog] =
    React.useState<boolean>(false);

  const navigate = useNavigate();
  const viewUserProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };
  const deleteUser = (id: string) => {
    setUserDelete(id);
    setUserDeleteDialog(true);
  };

  const onConfirmDeleteUser = (id: string) => {
    axios
      .delete(API_DELETEUSER_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
        params: {
          uid: id,
        },
      })
      .then((response) => {
        setUserDeleteDialog(false);

        if (response.status === 200) {
          toast.success(`User ${id} deleted`);
          setUserDelete('');
        } else {
          toast.error('Error deleting user');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'User ID',
      minWidth: 250,
    },
    {
      field: 'entityName',
      headerName: 'Entity Name',
      minWidth: 300,
      flex: 1,
    },
    {
      field: 'entityEmail',
      headerName: 'Email',
      minWidth: 250,
    },
    {
      field: 'entityABN',
      headerName: 'ABN Number',
      minWidth: 150,
    },
    {
      field: 'userType',
      headerName: 'User Type',
      minWidth: 110,
    },
    {
      field: 'entityAction',
      headerName: 'Action',
      type: 'actions',
      minWidth: 75,
      getActions({ id }) {
        return [
          <GridActionsCellItem
            icon={<PersonRemoveIcon />}
            label="More Actions"
            aria-label="more actions"
            onClick={() => {
              deleteUser(id.toString());
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<PageviewIcon />}
            label="More Actions"
            aria-label="more actions"
            onClick={() => {
              viewUserProfile(id.toString());
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
      .get(API_VIEWUSER_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token,
        },
      })
      .then((response) => {
        const data = response.data;
        const userRows: userData[] = data.map((user: any) => ({
          id: user._id.$oid,
          entityName: user.entityname,
          entityEmail: user.email,
          entityABN: user.abn,
          userType:
            user.role === '10'
              ? 'Admin'
              : user.role === '30'
              ? 'Professional'
              : user.role === '20'
              ? 'Company'
              : 'Invalid Role',
        }));
        setUserRows(userRows);
      })
      .catch((error) => {
        console.log(error.code);
      });
  }, [userDeleteState, props.token]);

  return (
    <>
      <Box sx={{ height: '100%', width: '100%', display: 'grid' }}>
        <DataGrid
          rows={userRows}
          columns={columns}
          autoHeight
          columnVisibilityModel={{
            id: false,
          }}
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
          openStatus={userDeleteDialog}
          onClose={() => {
            setUserDeleteDialog(false);
          }}
          title="Delete User"
          content={`Are you sure you want to delete user ${userDeleteState}? This action cannot be undone.`}
          cancelButton="Cancel"
          confirmButton="Delete"
          actionFn={() => {
            onConfirmDeleteUser(userDeleteState);
            setUserDeleteDialog(false);
            setUserDelete('');
          }}
        />
      </Box>
    </>
  );
};

export default UsersTable;
