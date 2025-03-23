import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ApprovalIcon from '@mui/icons-material/Approval';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

/**
 * Renders a list of menu items for professional users.
 * @param {Object} props - The props object.
 * @param {string} props.uid - The user ID of the professional user.
 * @returns {JSX.Element} - The rendered list of menu items.
 */
const professionalUserMenuItems = [
  'Projects',
  'My Applications',
  'My Projects',
  'My Certificates',
];
const ProfessionalsUserMenuItems = (props: { uid: string }) => {
  const navigate = useNavigate();

  return (
    <>
      {professionalUserMenuItems.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              text === 'Projects'
                ? navigate('/projects')
                : text === 'My Projects'
                ? navigate(`/profile/${props.uid}/projects`)
                : text === 'My Applications'
                ? navigate(`/applications`)
                : navigate(`/certificates`);
            }}
          >
            <ListItemIcon>
              {(() => {
                switch (text) {
                  case 'Projects':
                    return (
                      <ListItemIcon>
                        <BusinessCenterIcon />
                      </ListItemIcon>
                    );
                  case 'My Projects':
                    return (
                      <ListItemIcon>
                        <WorkHistoryIcon />
                      </ListItemIcon>
                    );
                  case 'My Applications':
                    return (
                      <ListItemIcon>
                        <ApprovalIcon />
                      </ListItemIcon>
                    );
                  case 'My Certificates':
                    return (
                      <ListItemIcon>
                        <EmojiEventsIcon />
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

export default ProfessionalsUserMenuItems;
