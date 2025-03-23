import React, { useState } from 'react';
import { BACKEND_API_URL } from '../../apis/config';
import {
	Grid,
	Box,
	Typography,
	Button,
	Container,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AllProjectUsers, ProjectData, User } from '../../apis/types';
import jwt from 'jwt-decode';
import makeRequestFn from '../../apis/makeRequest';


interface ProjectViewProps {
	token: string | null;
	pid: string | undefined | null;
}
const ProjectView: React.FC<ProjectViewProps> = ({ token, pid }) => {
	const API_PROJECTVIEWEQUEST_URL = `${BACKEND_API_URL}/view_project_detail?project_id=${pid}`;
	const [returnData, setReturnData] = useState<ProjectData>({
		title: '',
		description: '',
		category: '',
		budget: '',
		deadline: '',
		professional_num: '',
		status: '',
		date_created: '',
		project_type: '',
		project_location: '',
		manpower_required: '',
		project_owner: '',
		project_owner_name: ''
	});

	const [projectUsers, setProjectUsers] = useState<AllProjectUsers>({
		applied_users: [],
		approved_users: [],
		rejected_users: [],
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
	const navigate = useNavigate();
	React.useEffect(() => {
		axios
			.get(API_PROJECTVIEWEQUEST_URL, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			})
			.then((response) => {
				const fetchedData = response.data.data;
				console.log(fetchedData);
				if (fetchedData) {
					toast.success(response.data);
					setReturnData(fetchedData);
				} else {
					toast.error('Unexpected data structure from server.');
				}
			})
			.catch((e) => {
				// toast.error("Error message")
				toast.error(e.response.message);
			});
		getProjectUsers()
		console.log(projectUsers)
	}, [pid]);

	const getProjectUsers = async () => {
		await makeRequestFn('/view_all_project_user?project_id=' + pid, 'GET', undefined, token, handleProjectsUserData);
	}
	const handleProjectsUserData = (data: any) => {
		setProjectUsers({ applied_users: data.applied_users, approved_users: data.approved_users, rejected_users: data.rejected_users });

	}


	const projectOwnerCurrentStauts = () => {
		if (returnData.status === 'archived') {
			return 'Re-list Project'
		} else if (returnData.status === 'open') {
			return 'Start the Project'
		} else if (returnData.status === 'ongoing') {
			return 'Finish the project'
		} else if (returnData.status === 'completed') {
			return 'Return to My Projects'
		}
	}

	const editProject = async (newStatus: string) => {
		const body = {
			title: returnData.title,
			description: returnData.description,
			category: returnData.category,
			budget: returnData.budget,
			deadline: returnData.deadline,
			professional_num: returnData.professional_num,
			location: returnData.project_location,
			project_type: returnData.project_type,
			status: newStatus,
			project_id: pid
		};
		try {
			await makeRequestFn('/edit_project_detail', 'PUT', body, token, handleProjectEdit);
			await getProjectDetails()
			toast.success('Project status changed successfully to ' + returnData.status)
		} catch (error: any) {
			toast.error(error.message)
		}
	}
	const handleProjectEdit = (data: any) => {
		setReturnData(data.project_data)
	};
	const getProjectDetails = async () => {
		try {
			await makeRequestFn('/view_project_detail?project_id=' + pid, 'GET', undefined, token, handleDate);
		} catch (error: any) {
			toast.error(error.message)
		}
	}
	const handleDate = (data: any) => {
		setReturnData(data)
		console.log(data)
	};


	const handleOwnerClick = () => {
		if (returnData.status === 'archived') {
			editProject('open')
		} else if (returnData.status === 'open') {
			if (Number(returnData.manpower_required) === 0) {
				//Reject all applied users and change the status to ongoing
				projectUsers.applied_users.forEach((ProjectUsers) => {
					rejectUser(ProjectUsers.user_id);
				});
				//Change the status
				editProject('ongoing')
			} else if (Number(returnData.manpower_required) >= 0) {
				toast.error('Cannot start a project without enough members')
			} else if (Number(returnData.manpower_required) <= 0) {
				toast.error('Approved memebers is greater than project requirements')
			}
		} else if (returnData.status === 'ongoing') {
			editProject('completed')
		} else if (returnData.status === 'completed') {
			navigate('/projects')
		}
	}

	const rejectUser = async (user_id: string) => {
		await makeRequestFn('/reject_user?project_id=' + pid + '&reject_id=' + user_id, 'DELETE', undefined, token, undefined)
	}
	/*
	const rejectUser = async (user_id: string) => {
		await makeRequestFn('/reject_user?project_id=' + pid + '&reject_id=' + user_id, 'DELETE', undefined, token, undefined)
	}
	*/


	const handleProfessionalClick = () => {
		navigate(`/project/${pid}/apply`);

	}
	const handleReview = (reviewee: string) => {
		navigate(`/create_review/${pid}/${reviewee}`)
	}


	const rejectApprovedUser = async (user_id: string) => {
		try {
			await makeRequestFn('/edit_approved_user_list?project_id=' + pid + '&user_id=' + user_id, 'PUT', undefined, token, undefined)
			await getProjectUsers()
			toast.success('User has been removed from project')
		} catch (error: any) {
			toast.error(error.message)
		}

	}

	const boostProject = async (project_id: string | undefined | null) => {
		try {
			console.log(project_id)
			await makeRequestFn('/boost_project?project_id=' + pid, 'PUT', undefined, token, undefined)
			toast.success('Project has been successfully boosted')
		} catch (error: any) {
			console.log(error.message)
			toast.error(error.message)
		}
	}

	return (
		<Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center' }}>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection={'column'}
				width="70vw"
				my={2}
				p={3}
				boxShadow={3}
				borderRadius={2}
			>
				<Grid container spacing={1} justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5" gutterBottom align="center">
							{returnData.title}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle1" gutterBottom align="center">
							{returnData.description}
						</Typography>
					</Grid>
				</Grid>


				<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>

					<Grid item xs={12} md={6}  >
						<Grid container spacing={1}  >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Project Type
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">{returnData.project_type}</Typography>
							</Grid>
						</Grid>

					</Grid>
					<Grid xs={12} md={6}>
						<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex' >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Budget
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">${returnData.budget}</Typography>
							</Grid>
						</Grid>
					</Grid>


					<Grid item xs={12} md={6} >
						<Grid container spacing={1}  >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Project Location
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">{returnData.project_location}</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6}>
						<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex' >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Created On
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">{returnData.date_created}</Typography>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12} md={6} >
						<Grid container spacing={1}  >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Status
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">
									{returnData.status.charAt(0).toUpperCase() + returnData.status.slice(1).toLowerCase()}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6}>
						<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex' >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Required People
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">{returnData.manpower_required + "/" + returnData.professional_num}</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6}>
						<Grid container spacing={1}  >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Category
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">
									{returnData.category}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={6}>
						<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex' >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Deadline
								</Typography>
							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle2">{returnData.deadline}</Typography>
							</Grid>
						</Grid>
					</Grid>



					{(user.uid === returnData.project_owner || projectUsers.approved_users.some(ProjectUsers => ProjectUsers.user_id === user.uid || user.role === '10')) &&
						<Grid item xs={12} md={6}>
							<Grid container spacing={1}  >
								<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
									<Typography variant="subtitle1" fontWeight={'bold'} >
										Team Members
									</Typography>
								</Grid>
								<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
									<Box>
										{projectUsers.approved_users.map((ProjectUsers) => (
											<Box key={ProjectUsers.user_id} >
												<Link to={`/profile/${ProjectUsers.user_id}`} style={{ display: 'block', margin: '8px auto' }}>
													{ProjectUsers.name}
												</Link>
												{(returnData.status === 'completed' && user.uid !== ProjectUsers.user_id) &&
													<Button onClick={() => handleReview(ProjectUsers.user_id)} id={ProjectUsers.user_id} size="small">Leave Review</Button>
												}
												{((returnData.status === 'open' && user.uid === returnData.project_owner) || user.role === '10') &&
													<Button onClick={() => rejectApprovedUser(ProjectUsers.user_id)} color='error' size="small">Remove</Button>
												}
											</Box>
										))}</Box>
								</Grid>
							</Grid>
						</Grid>
					}
					<Grid item xs={12} md={6}>
						<Grid container spacing={1} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex' >
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Typography variant="subtitle1" fontWeight={'bold'} >
									Project Owner
								</Typography>

							</Grid>
							<Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} display='flex'>
								<Link to={`/profile/${returnData.project_owner}`} style={{ display: 'block', margin: '8px auto' }}>
									<Typography variant="subtitle1" style={{ wordWrap: 'break-word', hyphens: 'auto' }}>
										{returnData.project_owner_name}
									</Typography>
								</Link>



								{(returnData.status === 'completed' && user.uid !== returnData.project_owner && projectUsers.approved_users.some((obj) => obj.user_id === (user.uid))) &&
									<Button size="small" onClick={() => handleReview(returnData.project_owner)} >Leave Review</Button>
								}


							</Grid>
						</Grid>
					</Grid>
				</Grid>




				<Grid item xs={12} display="flex" justifyContent="center" mt={2} >
					{user.role === '20'
						? (user.uid === returnData.project_owner
							? <Button variant='contained' onClick={handleOwnerClick}>
								{projectOwnerCurrentStauts()}
							</Button>
							: <Button variant='contained' onClick={() => { navigate('/projects') }}>
								Return To Projects
							</Button>)
						: (!projectUsers.applied_users.some((obj) => obj.user_id === user.uid) &&
							!projectUsers.rejected_users.some((obj) => obj.user_id === user.uid) &&
							!projectUsers.approved_users.some((obj) => obj.user_id === user.uid)) &&
							returnData.status === 'open'
							? <Button variant='contained' onClick={handleProfessionalClick}>
								Apply For Project
							</Button>
							: <Button variant='contained' onClick={() => { navigate('/projects') }}>
								Return to Projects
							</Button>
					}


				</Grid>
				<Grid item xs={12} display="flex" justifyContent="center" mt={2}>
					{(returnData.status === 'open' && user.uid === returnData.project_owner) && <Button onClick={() => boostProject(pid)}>Boost Project</Button>}
				</Grid>
			</Box>
		</Container>


	);
}
export default ProjectView;
