import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
type Props = {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const buttonStyle = {
    fontSize: '15px', // font size
    width: '185px',
    height: '50px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '-100px'
    };

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center', 
  height: '20vh', 
};


const PrimaryButton: React.FC<Props> = ({onClick}) => {
    return (
    <Box sx={containerStyle}>
    <Button variant="contained" onClick={onClick} sx={buttonStyle }
    >Sign Up</Button>
    </Box> 
    );
};
export default PrimaryButton
        