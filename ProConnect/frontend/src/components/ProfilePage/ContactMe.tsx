import React from 'react';
import { Box, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

type ContactMeProps =  {
    phone: string;
    email: string;
}

const ContactMe: React.FC<ContactMeProps> = ({phone,email}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact me
      </Typography>
      <Box display="flex" alignItems="center" marginBottom={2}>
        <PhoneIcon color="action"/>
        <Typography variant='body1' sx={{ml:1}}>{phone}</Typography>
      </Box>

      <Box display="flex" alignItems="center" marginBottom={2}>
        <MailOutlineIcon color="action"/>
        <Typography variant='body1' sx={{ml:1}}>{email}</Typography>
      </Box>
    </Box>
  );
}
export default ContactMe;
