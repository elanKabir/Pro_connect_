import React from 'react';
import { Box, Typography, Button, Avatar, Grid, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProfilePageObject, } from '../../apis/types';

interface DeveloperProfileProps {
	ProfilePageObject: ProfilePageObject
	ProfileBoost: () => Promise<void>;
	AverageRating : string
}

const DeveloperProfile: React.FC<DeveloperProfileProps> = ({
	ProfilePageObject, ProfileBoost,AverageRating
}) => {
	const navigateToEditProfile = () => {
		navigate(`/profile/${ProfilePageObject.user_id}/edit_profile`);
	};
	const theme = useTheme();
	const navigate = useNavigate();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	let fontsize;
	let altText
	if (isSmallScreen) {
		fontsize = '25px';
		altText = '13px';
	} else if (isMediumScreen) {
		fontsize = '28px';
		altText = '20px';
	} else {
		fontsize = '30px';
		altText = '20px';
	}

	return (
		<Box sx={{ textAlign: 'center', padding: 0 }}>
			<Grid container spacing={1}
				display="flex"
				flexDirection="row"
				alignItems="center"
				justifyContent='space-evenly'
			>

				<Grid item xs={12}>
					<Avatar src={ProfilePageObject.avatarUrl} sx={{ width: 120, height: 120, margin: '0 auto' }} />
					<Typography variant="h4" sx={{ mt: 2 }}>
						{ProfilePageObject.userDetails.entityname}
					</Typography>
					<Divider sx={{ m: 1 }} />
					<Typography variant="h6"> {ProfilePageObject.userDetails.role === '30' ? 'Verified Professional' : ProfilePageObject.userDetails.role === '20' ? 'Registered Company' : ''}</Typography>
					<Typography variant="body1" sx={{ m: 1 }}>
						<span role="img" aria-label="location">📍</span> {ProfilePageObject.userDetails.location}
					</Typography>
					<Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold' }}>
						{ProfilePageObject.userProfileProjectStats.activeProjects} Active Projects
					</Typography>
				</Grid>

				{(ProfilePageObject.isUsersProfile && ProfilePageObject.userDetails.role === '30') &&
				<Grid item xs={12}>
					<Button sx={{color:'#C59E01', fontWeight: 'bold'}} onClick={ProfileBoost}  >
						BOOST
					</Button>
				</Grid>
				}


				<Grid item xs={4} md={4}>
					<Typography variant="h6" fontSize={fontsize}>{AverageRating}</Typography>
					<Typography fontSize={altText}>Rating</Typography>
				</Grid>
				<Grid item xs={4} md={4}>
					<Typography variant="h6" fontSize={fontsize}>{ProfilePageObject.userProfileProjectStats.completedProjects}</Typography>
					<Typography fontSize={altText}>Completed Projects</Typography>
				</Grid>
				<Grid item xs={4} md={4}>
					<Typography variant="h6" fontSize={fontsize}>${ProfilePageObject.userProfileProjectStats.averageProjects}</Typography>
					<Typography fontSize={altText}>Avg Budget</Typography>
				</Grid>

				<Grid item xs={12} md={12}>
					{ProfilePageObject.isUsersProfile && (
						<Button onClick={navigateToEditProfile} variant="outlined" fullWidth sx={{ mr: 2, textAlign: 'center' }} size="medium">
							Edit Profile
						</Button>
					)}
				</Grid>
				<Grid item xs={12} md={6}>
					<Button onClick={()=>{navigate(`/profile/${ProfilePageObject.user_id}/projects`)}} variant="outlined" fullWidth sx={{ mr: 2, textAlign: 'center' }} size='medium'>
						View All Projects
					</Button>
				</Grid>
				<Grid item xs={12} md={6}>
					<Button onClick={()=>{navigate(`/reviews/${ProfilePageObject.user_id}`)}}     variant="outlined" fullWidth sx={{ mr: 2, textAlign: 'center' }} size='medium'>
						View All Reviews
					</Button>
				</Grid>
			</Grid>

		</Box >
	);
};

export default DeveloperProfile;
