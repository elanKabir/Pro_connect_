import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const adminUserMenuItems = ['Dashboard', 'Users', 'Projects'];

/**
 * Renders a list of menu items for the admin user, including links to the dashboard, user list, and project list.
 */
const AdminUserMenuItems = () => {
  const navigate = useNavigate();
  return (
    <>
      {adminUserMenuItems.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              text === 'Dashboard'
                ? navigate('/admin/dashboard')
                : text === 'Users'
                ? navigate('/admin/view_users')
                : navigate('/admin/view_projects');
            }}
          >
            <ListItemIcon>
              {(() => {
                switch (text) {
                  case 'Dashboard':
                    return (
                      <ListItemIcon>
                        <DashboardIcon />
                      </ListItemIcon>
                    );
                  case 'Users':
                    return (
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                    );
                  case 'Projects':
                    return (
                      <ListItemIcon>
                        <BusinessCenterIcon />
                      </ListItemIcon>
                    );
                  default:
                    return null;
                }
              })()}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default AdminUserMenuItems;
