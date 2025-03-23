import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import ReviewComponent from './ReviewCard';
import { BACKEND_API_URL } from '../../apis/config';

const GET_REVIEWS_URL = `${BACKEND_API_URL}/view_all_reviews`;

interface ReviewProps {
    name: string;
    date: string;
    rating: number;
    reviewText: string;
    avatarSrc: string;

}

const dummyReviews = [
    {
        avatarSrc:"path_to_image.jpg",
        name:"Elan",
        date:"November 2022",
        rating:5,
        reviewText:"Beautiful property that is well maintained and extremely clean. Will stay there again in the future, great for a large group with kids as the property is spacious and have all the accessories such as high chair, kids cutleries etc."
    },
    {
        avatarSrc:"path_to_image.jpg",
        name:"Allen",
        date:"November 2022",
        rating:4,
        reviewText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        avatarSrc:"path_to_image.jpg",
        name:"Wing",
        date:"November 2022",
        rating:1,
        reviewText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        avatarSrc:"path_to_image.jpg",
        name:"Jenny",
        date:"November 2022",
        rating:3,
        reviewText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        avatarSrc:"path_to_image.jpg",
        name:"Jenny",
        date:"November 2022",
        rating:3,
        reviewText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },

];
export default function ReviewPagination() {
    const [page, setPage] = useState(1);
    const reviewsPerPage = 4; 
  
    const startIndex = (page - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
  
    const reviewsToDisplay = dummyReviews.slice(startIndex, endIndex);
  
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {reviewsToDisplay.map((review, index) => (
          <ReviewComponent
            key={index}
            avatarSrc={review.avatarSrc}
            name={review.name}
            date={review.date}
            rating={review.rating}
            reviewText={review.reviewText}
          />
        ))}
        <Box mt={4}>
          <Pagination
            count={Math.ceil(dummyReviews.length / reviewsPerPage)}
            page={page}
            onChange={handleChange}
          />
        </Box>
      </Box>
    );
  }