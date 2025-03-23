import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const guestMenuItem = ['Login', 'Register'];

/**
 * Renders a list of menu items for guest users, including Login and Register options.
 * @returns {JSX.Element} The JSX element representing the guest user menu items.
 */
const GuestUserMenuItems = () => {
  const navigate = useNavigate();

  return (
    <>
      {guestMenuItem.map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            onClick={() => {
              text === 'Login' ? navigate('/signin') : navigate('/signup');
            }}
          >
            <ListItemIcon>
              {text === 'Login' ? <LoginIcon /> : <HowToRegIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
      ;
    </>
  );
};

export default GuestUserMenuItems;
