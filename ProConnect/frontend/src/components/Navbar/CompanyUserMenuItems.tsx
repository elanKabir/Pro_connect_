import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AddBoxIcon from '@mui/icons-material/AddBox';

const companyUserMenuItems = [
  'Projects',
  'Create Project',
  'My Projects',
  'Search Professionals',
];

/**
 * Renders a list of menu items for a company user, including options to navigate to projects, create a project, view their own projects, and search for professionals.
 * @param {Object} props - The props object.
 * @param {string} props.uid - The unique identifier of the user.
 * @returns {JSX.Element} - The CompanyUserMenuItems component.
 */
const CompanyUserMenuItems = (props: { uid: string }) => {
  const navigate = useNavigate();
  return (
    <>
      {companyUserMenuItems.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              text === 'Projects'
                ? navigate('/projects')
                : text === 'Create Project'
                ? navigate('/project/create')
                : text === 'My Projects'
                ? navigate(`/profile/${props.uid}/projects`)
                : navigate('/professionals');
            }}
          >
            {(() => {
              switch (text) {
                case 'Projects':
                  return (
                    <ListItemIcon>
                      <BusinessCenterIcon />
                    </ListItemIcon>
                  );
                case 'Create Project':
                  return (
                    <ListItemIcon>
                      <AddBoxIcon />
                    </ListItemIcon>
                  );
                case 'My Projects':
                  return (
                    <ListItemIcon>
                      <WorkHistoryIcon />
                    </ListItemIcon>
                  );
                case 'Search Professionals':
                  return (
                    <ListItemIcon>
                      <PersonSearchIcon />
                    </ListItemIcon>
                  );
                default:
                  return null;
              }
            })()}
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default CompanyUserMenuItems;
