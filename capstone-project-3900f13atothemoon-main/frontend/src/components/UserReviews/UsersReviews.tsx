import React, { useEffect, useState } from 'react';

import { Box, Grid, Rating, Typography } from '@mui/material';
//import makeRequestFn from 'apis/makeRequest';


import makeRequestFn from '../../apis/makeRequest';

import { userDetails, ReviewData } from '../../apis/types';
import { toast } from 'react-toastify';
import PaginatedReviews from './AllReviewsPagination';

interface ProfilePageProps {
    token: string | null;
    user_id: string | undefined | null;
}

const UserReviews: React.FC<ProfilePageProps> = ({ token, user_id }) => {
    const [reviewsList, setReviewsList] = React.useState<ReviewData[]>([])
    const [averageReview, setAverageReview] = React.useState<string>('')
    const [userDetail, setUserDetail] = useState<userDetails>({
        email: '',
        entityname: '',
        phone: '',
        location: '',
        abn: '',
        role: '',
        cv_id: null,
        img_id: null,
        skills: [],
        company_bio: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                await makeRequestFn('/userdetail?user_id=' + user_id, 'GET', undefined, token, updateUserDetailState);
                // The `await` here waits for the `makeRequestFn` Promise to resolve before continuing.
            } catch (error: any) {
                toast.error(error.message);
            }
            try {
                await makeRequestFn('/v2/list_review?user_id=' + user_id, 'GET', undefined, token, setReviewListData);

            } catch (error: any) {
                setAverageReview('NA')
            }
        };
        fetchData(); // Immediately invoked async function inside useEffect
    }, [token, user_id]); // The effect will re-run if `token` changes.


    const setReviewListData = (data: any) => {
        setReviewsList(data.review_list)
        console.log(data.review_list[0].review_star)
        if (data.avg_rating) {
            setAverageReview(data.avg_rating)
        } else {
            setAverageReview('NA')
        }
    }
    const updateUserDetailState = async (data: any) => {
        setUserDetail(data.user_info)
    };


    return (
        <Box sx={{ textAlign: 'center', padding: 0 }}>
            <Grid container spacing={1}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent='space-evenly'
            >
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        {userDetail.entityname}
                    </Typography>
                </Grid>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12}>
                    <Rating name="read-only" value={Number(averageReview)} size='large' readOnly />
                </Grid>
            </Grid>
            <PaginatedReviews allReviews={reviewsList} />;

        </Box>
    );
}
export default UserReviews;