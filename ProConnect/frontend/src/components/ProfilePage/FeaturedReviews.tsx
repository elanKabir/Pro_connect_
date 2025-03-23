import React from 'react';
import { Box, Grid } from '@mui/material';
import ReviewComponent from './ReviewCard';
import { ReviewData } from '../../apis/types';


interface ReviewsGridProps {
  reviews: ReviewData[];
}

const ReviewsGrid: React.FC<ReviewsGridProps> = ({ reviews }) => {
    // Determine grid size for different breakpoints
    const getGridSize = (count: number): { xs: number, sm: number, md: number } => {
      if (count === 1) {
        return { xs: 12, sm: 12, md: 12 };
      } else if (count === 2) {
        return { xs: 12, sm: 6, md: 6 };
      } else {
        return { xs: 12, sm: 6, md: 4 };
      }
    };
  
    const gridSize = getGridSize(reviews.length);
  
    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={1}>
          {reviews.map((review) => (
            <Grid item xs={gridSize.xs} sm={gridSize.sm} md={gridSize.md} key={review.review_id}>
              <ReviewComponent ReviewData={{
                  user_id: review.user_id,
                  review_star: review.review_star,
                  rater_name: review.rater_name,
                  review_message: review.review_message,
                  review_id: review.review_id
              }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  export default ReviewsGrid;

