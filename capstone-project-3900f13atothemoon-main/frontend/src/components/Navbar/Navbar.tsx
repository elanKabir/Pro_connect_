import { AppBar, Avatar, IconButton } from '@mui/material';
import { Toolbar } from '@mui/material';
import { Button } from '@mui/material';
import Logo from '../../assets/logo_dark_revised.png';
import LogoSmall from '../assets/logo_moon_sm.png';
import { NotificationsOutlined } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Menu } from '@mui/material';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';
import React from 'react';
import jwt from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

type User = {
  uid: string;
  email: string;
  entityname: string;
  abn: string;
  role: string;
};
type ProfileMenuItem = {
  menuType: String;
  menuFunction: () => void;
};

/**
 * A component that renders the navigation bar of the application.
 * @returns The Navbar component.
 */
const Navbar = () => {
  const navivate = useNavigate();
  try {
    var token = localStorage.getItem('token');
    var user: User = jwt(token!);
  } catch (error) {
    console.log('User not logged in');
    user = {
      uid: 'null',
      email: 'null',
      entityname: 'null',
      abn: 'null',
      role: 'null',
    };
  }

  let userRole: number = user.role === 'null' ? 0 : parseInt(user.role);
  let userPicture: string = user.entityname.charAt(0);

  const [anchorElProfile, setAnchorElProfile] =
    React.useState<null | HTMLElement>(null);

  const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  const handleProfileClick = () => {
    console.log('Profile Option clicked');
    handleCloseProfileMenu();
  };

  const handleAccountClick = () => {
    console.log('Account Option clicked');
    handleCloseProfileMenu();
  };

  const handleLogoutClick = () => {
    // console.log('Logout clicked');
    localStorage.removeItem('token');
    navivate('/');
    handleCloseProfileMenu();
  };

  const handleLoginClick = () => {
    console.log('Login Click');
  };

  const profileMenu: ProfileMenuItem[] = [
    { menuType: 'Profile', menuFunction: handleProfileClick },
    { menuType: 'Account', menuFunction: handleAccountClick },
    { menuType: 'Logout', menuFunction: handleLogoutClick },
  ];

  const makeSearchBar = () => {
    return (
      <Grid item sm={6} xs={4}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            input: { color: 'white' },
            outlinedInput: { borderColor: 'white' },
          }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
        />
      </Grid>
    );
  };

  // TODO:
  // Make a function that make button set for all sets of users.
  const makeUserMenu = () => {
    return (
      <Grid container item sm={3} xs={6} justifyContent={'flex-end'}>
        {userRole === 20 ? <Button color="inherit">Create</Button> : null}
        <IconButton color="inherit" aria-label="Notifications">
          <NotificationsOutlined />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Profile"
          onClick={handleOpenProfileMenu}
        >
          <Avatar>{userPicture}</Avatar>
        </IconButton>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElProfile}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElProfile)}
          onClose={handleCloseProfileMenu}
        >
          {profileMenu.map((p, index) => (
            <MenuItem key={index} onClick={p.menuFunction}>
              <Typography textAlign="center">{p.menuType}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    );
  };

  const renderUserSpecificMenu = () => {
    switch (userRole) {
      // Professional
      case 30:
        return (
          <>
            {makeSearchBar()}
            {makeUserMenu()}
          </>
        );

      // Company User
      case 20:
        return (
          <>
            {makeSearchBar()}
            {makeUserMenu()}
          </>
        );

      // Admin User
      case 10:
        return (
          <>
            {makeSearchBar()}
            {makeUserMenu()}
          </>
        );

      // Guest
      default:
        return (
          <Link to="/Login">
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          </Link>
        );
    }
  };

  return (
    <AppBar position="static" sx={{ marginBottom: 5 }}>
      <Toolbar>
        <Grid container justifyContent={'space-between'} alignItems={'center'}>
          <Grid
            container
            item
            sm={3}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <a href="/">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: '40px', verticalAlign: 'bottom' }}
              />
            </a>
          </Grid>

          <Grid container item sm={3} xs={2} sx={{ display: { sm: 'none' } }}>
            <a href="/">
              <img
                src={LogoSmall}
                alt="Logo"
                style={{ height: '40px', verticalAlign: 'bottom' }}
              />
            </a>
          </Grid>

          {renderUserSpecificMenu()}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
