import * as React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';



interface SingleReviewProps {
    token: string | null;
    review_id: string | undefined
    user_id: string | undefined
}

const ViewSingleReview: React.FC<SingleReviewProps> = ({review_id,token, user_id}) => {

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%" // Takes the full width of the parent
            my={2}
        >
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent='center'
                width="90%" // Adjust width as needed
                mx="auto" // Centers the Box horizontally
                p={3}
                boxShadow={3}
                borderRadius={2}
            >
                <Box display="flex" flexDirection="column" flexGrow={1} alignItems="center" width="100%" mb={2}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="h5">NAME</Typography>
                    </Box>
                    <Rating name="read-only" value={5} readOnly />
                    <Typography
                        variant="body1"
                        textAlign={'center'}
                        mt={2}
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 7,
                        }}
                    >
                        message
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ViewSingleReview;
