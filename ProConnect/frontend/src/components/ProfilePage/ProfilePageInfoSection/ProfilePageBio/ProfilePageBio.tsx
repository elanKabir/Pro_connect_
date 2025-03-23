import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { ProfilePageObject, Setters } from '../../../../apis/types';
import makeRequestFn from '../../../../apis/makeRequest';
import { toast } from 'react-toastify';

interface EditableTextProps {
	initialText: string;
	ProfilePageObject: ProfilePageObject
	Setters : Setters

}

const ProfilePageBio: React.FC<EditableTextProps> = ({ initialText,ProfilePageObject,Setters}) => {
	const [text, setText] = useState<string>(initialText);
	const [tempText, setTempText] = useState<string>('');
	const [isEditing, setIsEditing] = useState(false);
	const [isError, setIsError] = useState(false);
	const maxWords = 100

	const handleEditClick = () => {
		setIsEditing(true);
		setTempText(text)
	};

	const handleSaveClick = async () => {
		await handleBioChange(tempText)
		setIsEditing(false);
	};

	const setEditText = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		const words = newValue.split(/\s+/).filter(Boolean);
		setTempText(newValue);
		if (words.length <= maxWords) {
			setIsError(false);
		} else {
			setIsError(true);
		}
	};
	const handleBioChange = async (newBio :string) => {
		//Bio has changed
		if (newBio !== text) {
			const body = {
				user_id: ProfilePageObject.user.uid,
				company_bio: newBio
			}
			try {
				await makeRequestFn('/add_company_bio','POST', body, ProfilePageObject.token, undefined);
				toast.success('Bio has been updated successfully')
				setText(newBio)
				Setters.getUserDetails()
			} catch {
				toast.error('Error occured when trying to update bio')
			}
		}
	}
	/*
	useEffect(() => {
        setText(ProfilePageObject.userDetails.company_bio)
    }, [ProfilePageObject.token, ProfilePageObject.user_id ,ProfilePageObject.user,ProfilePageObject.userDetails]);
	*/

	return (
		<Box
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		width='100%'
		>
			{isEditing ? (
				<Grid container spacing={2} sx={{width:'100%'}}>
					<Grid item xs={12}>
						<TextField
							sx={{width:'100%'}}
							value={tempText}
							onChange={setEditText}
							variant="outlined"
							label="Edit Bio"
							multiline
							error={isError}
							maxRows={50}
							helperText={
								isError
								? `Word limit exceeded! Max ${maxWords} words allowed.`
								: `${tempText.split(/\s+/).filter(Boolean).length}/${maxWords} words`
							}
						/>
					</Grid>
					<Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Button
							sx={{alignItems:'center', justifyContent:'center'}}
							disabled={isError}
							onClick={handleSaveClick}
							color="primary"
							variant="contained"
							style={{ marginLeft: '10px' }}
							size='medium'>
							Save
						</Button>
					</Grid>
				</Grid>
			) : (
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="body1" >
							{text}
						</Typography>
					</Grid>
					<Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{ProfilePageObject.isUsersProfile && (
						<Button
							onClick={handleEditClick}
							color="secondary"
							variant="contained"
							style={{ marginTop: 10 }}
							size='medium'
						>
						Edit
						</Button>
					)}
					</Grid>
				</Grid>
			)}
		</Box>
	);
};

export default ProfilePageBio;
