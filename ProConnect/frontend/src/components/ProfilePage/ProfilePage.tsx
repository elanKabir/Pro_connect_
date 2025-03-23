import React, { useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { Box, Divider, Grid } from '@mui/material';
//import makeRequestFn from 'apis/makeRequest';
import DeveloperProfile from './ProfilePageHeader';
import ProfileTab from './ProfilePageInfoSection/ProfilePageTab/ProfileTab';
import ContactMe from './ContactMe';
import makeRequestFn from '../../apis/makeRequest';
import { userDetails, User, userProfileProjectStats, Cv_information, ProfilePageObject, Setters, ReviewData } from '../../apis/types';
import { toast } from 'react-toastify';

interface ProfilePageProps {
    token: string | null;
    user_id: string | undefined | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ token, user_id }) => {
    const [profilePicture, setProfilePicture] = React.useState<string>('');
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
    const [reviewsList, setReviewsList] = React.useState<ReviewData[]>([])
    const [averageReview, setAverageReview] = React.useState<string>('')
    const [projectStates, setProjectStatus] = useState<userProfileProjectStats>({
        activeProjects: null,
        completedProjects: null,
        averageProjects: null
    });

    const [isUsersProfile, setIsUsersProfile] = useState<boolean>(false)

    const [cvData, setCvData] = useState<Cv_information>({
        base64: '',
        fileName: '',
        contentType: '',
    })

    try {
        var user: User = jwt(token!);
    } catch (error) {
        user = {
            uid: 'null',
            email: 'null',
            entityname: 'null',
            abn: 'null',
            role: 'null',
        };
    }


    const getUserDetails = async () => {
        await makeRequestFn('/userdetail?user_id=' + user_id, 'GET', undefined, token, updateUserDetailState);
    }

    const Setters: Setters = {
        setProfilePicture,
        setUserDetail,
        setProjectStatus,
        setIsUsersProfile,
        setCvData,
        getUserDetails
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await makeRequestFn('/userdetail?user_id=' + user_id, 'GET', undefined, token, updateUserDetailState);
                // The `await` here waits for the `makeRequestFn` Promise to resolve before continuing.
            } catch (error: any) {
                toast.error(error.message);
            }
            try {
                await makeRequestFn('/view_profile_projectlist?user_id=' + user_id, 'GET', undefined, token, getProjectStats);
                // Same here, it waits for the `makeRequestFn` Promise to resolve.
            } catch (error: any) {
                toast.error(error.message);
            }
            try {
                await makeRequestFn('/v2/list_review?user_id=' + user_id, 'GET', undefined, token, setReviewListData);

            } catch (error: any) {
                setAverageReview('NA')
            }
        };
        fetchData(); // Immediately invoked async function in useEffect
        if (user.uid === user_id) {
            setIsUsersProfile(true)
        }
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
        if (data.img_data !== null) {
            const imageSrc = 'data:' + data.img_data.content_type + ';base64,' + data.img_data.data.$binary.base64
            setProfilePicture(imageSrc)
        } else {
            setProfilePicture('')
        }
        if (data.cv_data !== null) {
            setCvData({
                base64: data.cv_data.data.$binary.base64,
                fileName: data.cv_data.filename,
                contentType: data.cv_data.content_type,
            })
        }
    };
    const handleProfileBoost = async () => {
        try {
            await makeRequestFn('/boost_profile', 'POST', undefined, token, undefined);
            toast.success('Profile Boost Applied')
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    // Define your object based on the ProfilePageObject structure
    const profilePageObject: ProfilePageObject = {
        userDetails: userDetail, // if userDetail is defined and matches with userDetails type
        user: user, // if user is defined and matches with User type
        userProfileProjectStats: projectStates, // if projectStates is defined and matches the userProfileProjectStats type
        Cv_information: cvData, // Define cvInformation to match the Cv_information type
        token: token, // replace someToken with the actual token, or null if none
        user_id: user_id, // user_id is a string containing the user's ID
        avatarUrl: profilePicture, // profilePicture is a string containing the URL to the user's avatar
        isUsersProfile: isUsersProfile // isUsersProfile is a boolean meaning if this is the user's profile
    };


    const getProjectStats = (data: [any]) => {
        const projects = data
        const activeProjectsCount = projects.filter(projects => projects.status === "open" || projects.status === "ongoing").length;
        setProjectStatus(prevState => ({ ...prevState, activeProjects: activeProjectsCount }));

        const averageBudgetProjects = projects.filter(projects => projects.status === "open" || projects.status === "ongoing" || projects.status === "completed");
        const totalBudget = averageBudgetProjects.reduce((sum, projects) => sum + Number(projects.budget), 0);
        const averageBudget = averageBudgetProjects.length > 0 ? totalBudget / averageBudgetProjects.length : 0;
        setProjectStatus(prevState => ({ ...prevState, averageProjects: Math.round(averageBudget) }));

        const completedProjectsCount = projects.filter(projects => projects.status === "completed").length;
        setProjectStatus(prevState => ({ ...prevState, completedProjects: completedProjectsCount }));
    }
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <Grid container spacing={1} alignItems="center" width={'90vw'} >
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <DeveloperProfile
                        ProfilePageObject={profilePageObject}
                        ProfileBoost={handleProfileBoost}
                        AverageRating={averageReview}
                    />
                </Grid>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={12}>
                    <ProfileTab ProfilePageObject={profilePageObject} Setters={Setters} user_id={user_id} allReviews={reviewsList} />
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                    <ContactMe phone={userDetail.phone} email={userDetail.email} />
                </Grid>
            </Grid>
        </Box>
    );
}
export default ProfilePage;