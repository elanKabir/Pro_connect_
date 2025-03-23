import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface ReviewProps {
  avatarSrc: string;
  name: string;
  date: string;
  rating: number;
  reviewText: string;
}

const ReviewComponent: React.FC<ReviewProps> = (props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="80%"
      mx="auto"
      my={2}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={props.avatarSrc} alt={props.name} style={{ marginRight: '8px' }}/>
        <Typography variant="h5">{props.name}</Typography>
      </Box>
      <Typography variant="subtitle1"  textAlign={'center'} color="textSecondary" mb={2}>
        {props.date}
      </Typography>
      <Rating name="read-only" value={props.rating} readOnly />
      <Typography variant="body1" textAlign={'center'} mt={2}>
        {props.reviewText}
      </Typography>
    </Box>
  );
}

export default ReviewComponent;
