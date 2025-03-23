import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { ReviewData } from '../../apis/types';


interface AllReviewCardsProps {
  reviews: ReviewData[];
}

const ReviewCards: React.FC<AllReviewCardsProps> = (reviews) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {reviews.reviews.map(review => (
        <Box
          key={review.review_id} // Ensure each review has a unique key
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
          <Box display="flex" flexDirection="column" flexGrow={1} alignItems="center" width="100%" mb={2}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h5">{review.rater_name}</Typography>
            </Box>
            <Rating name="read-only" value={Number(review.review_star)} readOnly />
            <Typography
              variant="body1"
              textAlign={'center'}
              mt={2}
              sx={{
                display: '-webkit-box',
                textOverflow: 'ellipsis',
                WebkitBoxOrient: 'vertical',
              // Change the number 3 to the number of lines you want to display
              }}
            >
              {review.review_message}
            </Typography>
          </Box>
        </Box>


      ))}
    </Box >





  );
}

export default ReviewCards;
