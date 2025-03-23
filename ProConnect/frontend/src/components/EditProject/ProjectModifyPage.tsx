import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import makeRequestFn from '../../apis/makeRequest';
import EditProject from './EditProject';
import { toast } from 'react-toastify';
import { ProjectData } from '../../apis/types';

type ProjectModifyPageProps = {
	token: string | null;
	setToken: (token: string | null) => void;
	project_id: string | undefined
};
const ProjectModifyPage: React.FC<ProjectModifyPageProps> = ({
	token,
	setToken,
	project_id
}) => {

	const [ProjectData, setProjectData] = useState<ProjectData>({
	title: '',
    description: '',
    category:'',
    budget: '',
    deadline: '',
    professional_num: '',
    project_type: '',
    project_location: '',
    status: '',
    date_created :'',
    manpower_required :'',
    project_owner: '',
    project_owner_name: ''
	})
	



	const handleDate = (data: any) => {
		setProjectData(data)
	};

	useEffect(() => {
		try {
			makeRequestFn('/view_project_detail?project_id=' + project_id, 'GET', undefined, token, handleDate);
		} catch (error:any) {
			toast.error(error.message)
		}
	}, [project_id]);

	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height="auto"
		>
			<Grid container spacing={4}>
				<Grid item xs={12}
					sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
				>
					<Typography variant="h5" justifyContent="center">
						Edit Project Details
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<EditProject token={token} setToken={setToken} project_id={project_id} ProjectData={ProjectData} setProjectData={setProjectData}/>
				</Grid>
			</Grid>
		</Box>
		);
	};
	export default ProjectModifyPage;
