import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../ConfirmationDialog';
import { toast } from 'react-toastify';

const profileMenuItems = ['Profile', 'Logout'];

/**
 * Renders a list of menu items for the user profile dropdown in the navbar.
 * @param {Object} props - The props object.
 * @param {string} props.uid - The user ID.
 * @param {string | null} props.token - The user token.
 * @param {(token: string | null) => void} props.setTokenHandler - The function to set the user token.
 * @returns {JSX.Element} - The JSX element for the profile menu items.
 */
const ProfileMenuItems = (props: {
  uid: string;
  token: string | null;
  setTokenHandler: (token: string | null) => void;
}) => {
  const navigate = useNavigate();

  const [userLogoutDialog, setUserLogoutDialog] =
    React.useState<boolean>(false);

  const userLogout = () => {
    localStorage.removeItem('token');
    props.setTokenHandler(null);

    toast.success('Logged out successfully');
  };

  return (
    <>
      {profileMenuItems.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              switch (text) {
                case 'Profile':
                  // console.log('Profile clicked');
                  navigate(`/profile/${props.uid}`);
                  break;
                case 'Logout':
                  setUserLogoutDialog(true);
                  break;
                default:
                  break;
              }
            }}
          >
            <ListItemIcon>
              {text === 'Profile' ? <AccountBoxIcon /> : <LogoutIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}

      <ConfirmationDialog
        openStatus={userLogoutDialog}
        onClose={() => {
          setUserLogoutDialog(false);
        }}
        title="Logout?"
        content={'Are you sure you want to logout?'}
        cancelButton="Cancel"
        confirmButton="Logout"
        actionFn={() => {
          userLogout();
          setUserLogoutDialog(false);
          navigate('/');
        }}
      />
    </>
  );
};

export default ProfileMenuItems;
