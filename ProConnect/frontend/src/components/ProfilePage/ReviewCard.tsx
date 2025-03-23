import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { ReviewData } from '../../apis/types';

interface ReviewProps {
  ReviewData: ReviewData
}

const ReviewComponent: React.FC<ReviewProps> = (ReviewData) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="90%"
      minHeight={250}
      mx="auto"
      my={2}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h5">{ReviewData.ReviewData.rater_name}</Typography>
      </Box>
      <Rating name="read-only" value={Number(ReviewData.ReviewData.review_star)} readOnly />
      <Typography
        variant="body1"
        textAlign={'center'}
        mt={2}
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3, // Change the number 3 to the number of lines you want to display
        }}
      >
        {ReviewData.ReviewData.review_message}
      </Typography>
    </Box>
  );
}

export default ReviewComponent;
