import React, { useEffect, useRef } from 'react';
import { Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_API_URL } from '../../apis/config';
import {
  skillsDataSet, workLocationDataSet, typeOfProjectDataSet,
} from '../ProjectListing/Data';

const CREATE_PROJECT_URL = `${BACKEND_API_URL}/create_project`;

const CreateProjectForm = () => {
	const [projectTitle, setProjectTitle] = React.useState<string>('');
	const [projectDescription, setProjectDescription] = React.useState<string>('');
	const [budget, setBudget] = React.useState<string>('');
	const [deadline, setDeadline] = React.useState<string>('');
	const [professionalNumber, setProfessionalNumber] = React.useState<string>('');
	const [selectedSkill, setSelectedSkill] = React.useState<string>('');
	const [selectedLocation, setSelectedLocation] = React.useState<string>('');
	const [selectedTypeOfProject, setSelectedTypeOfProject] = React.useState<string>('');

	const navigate = useNavigate();

	useEffect(() => {
		if (selectedTypeOfProject === 'Individual') {
			setProfessionalNumber('1');
		} else if (selectedTypeOfProject === 'Group' && parseInt(professionalNumber) < 2) {
			setProfessionalNumber('2');
		}
	}, [selectedTypeOfProject, professionalNumber]);

	const getTomorrow = () => {
		const today = new Date();
		today.setDate(today.getDate() + 1);
		return today.toISOString().split('T')[0];
	};

	const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const projectData = {
			title: projectTitle,
			description: projectDescription,
			category: selectedSkill,
			budget: budget,
			deadline: deadline, 
			professional_num: professionalNumber,	
			location: selectedLocation,
			project_type: selectedTypeOfProject,
		};

		axios.post(CREATE_PROJECT_URL, projectData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
			}
		}).then((response) => {
			toast.success(response.data.message)
			navigate('/');
		}).catch(() => {
			toast.error("Error message")
		});
	};

	const dateInputRef = useRef<HTMLInputElement | null>(null);

	const handleSelectDate = () => {
		if (dateInputRef.current) {
			dateInputRef.current.focus();
		}
	};

	const handleSkillChange = (event: SelectChangeEvent<string>) => {
		setSelectedSkill(event.target.value as string);
	};

	const handleLocationChange = (event: SelectChangeEvent<string>) => {
		setSelectedLocation(event.target.value as string);
	};

	const handleTypeOfProjectChange = (event: SelectChangeEvent<string>) => {
		setSelectedTypeOfProject(event.target.value as string);
		if (event.target.value === 'Individual') {
			setProfessionalNumber('1');
		} else if (event.target.value === 'Group' && parseInt(professionalNumber) < 2) {
			setProfessionalNumber('2');
		}
	};

	const commonStyle = { marginBottom: '8px', width: '100%' }; 

	return (
		<form onSubmit={handleCreateProject} style={{ width: '100%' }}>
		<Grid container spacing={1} style={{ width: '100%' }}>
			<Grid item xs={12}>
				<TextField
					required
					id="projectTitle"
					label="Project Title"
					fullWidth
					value={projectTitle}
					margin="normal"
					onChange={(e) => setProjectTitle(e.target.value)}
					style={commonStyle}
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="typeOfProject-label" required>
						Type of Project
					</InputLabel>
					<Select
						required
						id="typeOfProject"
						label="Type of Project"
						fullWidth
						value={selectedTypeOfProject}
						onChange={handleTypeOfProjectChange}
						style={commonStyle}
					>
						{typeOfProjectDataSet.map((type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
					required
					id="projectDescription"
					label="Project Description"
					fullWidth
					multiline
					rows={4}
					value={projectDescription}
					margin="normal"
					onChange={(e) => setProjectDescription(e.target.value)}
					style={commonStyle}
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="category-label" required>
						Category
					</InputLabel>
					<Select
						required
						id="category"
						label="Category"
						fullWidth
						value={selectedSkill}
						onChange={handleSkillChange}
						style={commonStyle}
					>
						{skillsDataSet.map((skill) => (
							<MenuItem key={skill} value={skill}>
								{skill}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
					required
					id="budget"
					label="Budget (AUD)"
					type="number"
					fullWidth
					value={budget}
					margin="normal"
					onChange={(e) => setBudget(e.target.value)}
					style={commonStyle}
					inputProps={{ min: 1 }}
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="location-label" required>
						Work Location
					</InputLabel>
					<Select
						required
						id="workLocation"
						label="Work Location"
						fullWidth
						value={selectedLocation}
						onChange={handleLocationChange}
						style={commonStyle}
					>
						{workLocationDataSet.map((location) => (
							<MenuItem key={location} value={location}>
								{location}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<TextField
					required
					id="deadline"
					label="Deadline"
					type="date"
					fullWidth
					value={deadline}
					margin="normal"
					onChange={(e) => setDeadline(e.target.value)}
					style={commonStyle}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start" onClick={handleSelectDate} style={{ cursor: 'pointer' }}></InputAdornment>
						),
					}}
					inputProps={{ min: getTomorrow() }}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					required
					id="professionalNumber"
					label="Number of Professionals Required"
					type="text"
					fullWidth
					value={professionalNumber}
					margin="normal"
					onChange={(e) => setProfessionalNumber(e.target.value)}
					style={commonStyle}
					inputProps={{ min: 1 }}
				/>
			</Grid>
			<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
				<Button type="submit" variant="contained" style={{ width: '60%', height: '45px' }}>
					<span style={{ fontSize: '14px' }}>Create Project</span>
				</Button>
			</Grid>
		</Grid>
		</form>
	);
};

export default CreateProjectForm;
