import { Box, Button, Card, CardActions, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Rating, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { typeOfProjectDataSet, skillsDataSet, workLocationDataSet } from '../ProjectListing/Data';
import { toast } from 'react-toastify';
import { User, userDetails } from '../../apis/types';
import makeRequestFn from '../../apis/makeRequest';
import { Navigate, useNavigate } from 'react-router-dom';

type Props = {
    token: string | null;
    project_id: string | undefined
    user_id : string | undefined
};

const ReviewForm: React.FC<Props> = (props) => {
    const navigate = useNavigate();
    const [value, setValue] = React.useState<number | null>(0);
    const [reviewDescription,setReviewDescription] = React.useState<string>('')
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
    });
    const updateUserDetailState = async (data: any) => {
        console.log(data)
        setUserDetail(data.user_info)
    }
    try {
		var user: User = jwt(props.token!);
	} catch (error) {
		user = {
			uid: 'null',
			email: 'null',
			entityname: 'null',
			abn: 'null',
			role: 'null',
		};
	}

    useEffect(() => {
        const fetchData = async () => {
          try {
            await makeRequestFn('/userdetail?user_id=' + props.user_id, 'GET', undefined, props.token, updateUserDetailState);
            // The `await` here waits for the `makeRequestFn` Promise to resolve before continuing.
          } catch (error: any) {
            toast.error(error.message);
          }
        }
        fetchData()
    }, [props.token, props.user_id]);

    const handleSubmitReview = async () => {
        if (reviewDescription === '') {
            toast.error("Description field can't be left empty")
            return
        }
        if (value === 0) {
            toast.error('Please choose a rating')
            return
        }
        const body = {
            star_rating : String(value),
            review_message: reviewDescription,
            receiver_user_id: props.user_id,
            project_id: props.project_id
        }
        try {
            await makeRequestFn('/create_review', 'POST', body, props.token, handleReturnData)
            toast.success('Review successfully created')
            navigate(`/project/${props.project_id}`)

        } catch (error:any) {
            toast.error(error.message)
        }
    }

    const handleReturnData = (data :any) => {
        console.log(data)
    }


    return (
    <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent='space-evenly'>

        <Card sx={{width:'90vw', mt:2}}>
            <CardContent>
                <Grid container spacing={1} item xs={12} sx={{ mt: 1, width: '100%' }}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} >
                        <Typography  sx={{ textAlign: 'center' }}  variant='h5'>Leave a Review for {userDetail.entityname}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1,width: '100%' }} >
                        <Typography  sx={{ textAlign: 'center' }} variant='h6' component="legend">Overall Rating</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Rating size="large" name="no-value" value={value}  onChange={(event, newValue) => {setValue(newValue);}}/>
                    </Grid>
                    <Grid  item xs={12}>
                        <TextField
                            required
                            id="review_description"
                            label="Review Details"
                            fullWidth
                            multiline
                            rows={9}
                            margin="normal"
                            onChange={(event) => setReviewDescription(event.target.value)}
                        />
                    </Grid>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" onClick={handleSubmitReview} >Submit</Button>
                </Grid>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={()=>{navigate(`/project/${props.project_id}`)}}>Cancel</Button>
                </Grid>
                </Grid>
            </CardContent>

        </Card>
    </Box>
    )
 };

export default ReviewForm

function jwt(arg0: string): User {
    throw new Error('Function not implemented.');
}
