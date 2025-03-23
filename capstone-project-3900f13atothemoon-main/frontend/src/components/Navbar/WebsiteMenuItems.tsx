import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const websiteMenuItem = ['Home'];

/**
 * Renders the website menu items.
 * @returns JSX.Element
 */
const WebsiteMenuItems = () => {
  const navigate = useNavigate();
  return (
    <>
      {websiteMenuItem.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              text === 'Home' ? navigate('/') : navigate('/');
            }}
          >
            {text === 'Home' && (
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
            )}
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
};

export default WebsiteMenuItems;
