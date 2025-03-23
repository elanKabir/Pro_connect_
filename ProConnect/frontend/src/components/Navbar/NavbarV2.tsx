import React from 'react';
import axios from 'axios';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.png';
import { Grid, List, useMediaQuery } from '@mui/material';

import ProfileMenuItems from './ProfileMenuItems';

import jwt from 'jwt-decode';
import GuestUserMenuItems from './GuestUserMenuItems';
import AdminUserMenuItems from './AdminUserMenuItems';
import ProfessionalsUserMenuItems from './ProfessionalUserMenuItems';
import CompanyUserMenuItems from './CompanyUserMenuItems';
import WebsiteMenuItems from './WebsiteMenuItems';
import NotificationItem from './NotificationItem';
import { BACKEND_API_URL } from '../../apis/config';
const API_NOTIFICATION_URL = BACKEND_API_URL + '/list_notification';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

type User = {
  uid: string;
  email: string;
  entityname: string;
  abn: string;
  role: string;
};

type Notification = {
  notification_id: string;
  user_id: string;
  message: string;
  timestamp: string;
  read_status: string;
};

/**
 * A navigation bar component with a drawer and various menu items based on user type.
 * @param {Object} props - The component props.
 * @param {string} props.pageTitle - The title of the current page.
 * @param {JSX.Element} props.pageElement - The element to be rendered as the main content of the page.
 * @param {string | null} props.token - The JWT token of the authenticated user.
 * @param {(token: string | null) => void} props.setTokenHandler - A function to set the JWT token of the authenticated user.
 * @returns {JSX.Element} - A JSX element representing the NavbarV2 component.
 */
const NavbarV2 = (props: {
  pageTitle: string;
  pageElement: JSX.Element;
  token: string | null;
  setTokenHandler: (token: string | null) => void;
}) => {
  const navigate = useNavigate();

  const theme = useTheme();

  try {
    var user: User = jwt(props.token!);
  } catch (error) {
    user = {
      uid: 'null',
      email: 'null',
      entityname: 'null',
      abn: 'null',
      role: 'null',
    };
  }

  const userType = user.role;

  // const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = React.useState(!isMobile);

  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(API_NOTIFICATION_URL, {
        headers: {
          Authorization: 'Bearer ' + props.token,
        },
      });

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.notification_list)
      ) {
        const recievedNotification: Notification[] =
          response.data.data.notification_list;
        setNotifications(recievedNotification);
      } else {
        console.error(
          'Notification list is not an array:',
          response.data.data.notification_list
        );
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationsClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const renderNotifications = () => {
    if (notifications.length === 0) {
      // Return a message or component indicating no notifications
      return (
        <Typography variant="subtitle1" align="center" style={{ marginTop: '20px' }}>
          No new notifications
        </Typography>
      );
    }
    return (
      <List>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
            token={props.token}
            onNotificationUpdate={updateNotifications}
          />
        ))}
      </List>
    );
  };

  React.useEffect(() => {
    if (props.token) {
      fetchNotifications();
    }
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [props.token, isMobile, fetchNotifications]);

  const updateNotifications = () => {
    fetchNotifications();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Grid container item sm={3} xs={6}>
              <Typography variant="h6" noWrap component="div">
                {props.pageTitle}
              </Typography>
            </Grid>

            <Grid container item sm={3} xs={6} justifyContent={'flex-end'}>
              {props.token ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="Notifications"
                    onClick={handleNotificationsClick}
                  >
                    <NotificationsIcon />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={modalOpen}
                    onClose={handleCloseModal}
                    sx={{
                      '& .MuiDrawer-paper': { width: '30%' },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        padding: 2,
                        backgroundColor: 'smokewhite',
                      }}
                    >
                      {renderNotifications()}
                    </Box>
                  </Drawer>
                </>
              ) : null}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: 175, verticalAlign: 'bottom', cursor: 'pointer' }}
            onClick={() => {
              navigate('/');
            }}
          />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {<WebsiteMenuItems />}
        <Divider />
        {
          {
            null: <>{<GuestUserMenuItems />}</>,
            '10': (
              <>
                {<AdminUserMenuItems />} <Divider />{' '}
                {
                  <ProfileMenuItems
                    token={props.token}
                    setTokenHandler={props.setTokenHandler}
                    uid={user.uid}
                  />
                }
              </>
            ),
            '20': (
              <>
                {<CompanyUserMenuItems uid={user.uid} />} <Divider />{' '}
                {
                  <ProfileMenuItems
                    token={props.token}
                    setTokenHandler={props.setTokenHandler}
                    uid={user.uid}
                  />
                }
              </>
            ),
            '30': (
              <>
                {<ProfessionalsUserMenuItems uid={user.uid} />} <Divider />{' '}
                {
                  <ProfileMenuItems
                    token={props.token}
                    setTokenHandler={props.setTokenHandler}
                    uid={user.uid}
                  />
                }
              </>
            ),
          }[userType]
        }
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        {props.pageElement}
      </Main>
    </Box>
  );
};

export default NavbarV2;
