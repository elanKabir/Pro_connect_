import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';
import AllReviewCards from './AllReviewCards';
import { ReviewData } from '../../apis/types';

const REVIEWS_PER_PAGE = 5;

interface AllReviewCardsProps {
  allReviews: ReviewData[];
}
const PaginatedReviews: React.FC<AllReviewCardsProps> = ({ allReviews }) => {
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const indexOfLastReview = page * REVIEWS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - REVIEWS_PER_PAGE;
  const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <Box>
      <AllReviewCards reviews={currentReviews} />

      <Pagination
        count={Math.ceil(allReviews.length / REVIEWS_PER_PAGE)}
        page={page}
        onChange={handleChange}
      />
    </Box>
  );
};

export default PaginatedReviews;
