import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import makeRequestFn from '../../apis/makeRequest';
import { toast } from 'react-toastify';
import { skillsDataSet } from '../ProjectListing/Data';
import { ProjectData } from '../../apis/types';

type ProjectModifyPageProps = {
  token: string | null,
  setToken: (token: string | null) => void,
  project_id: string | undefined,
  ProjectData: ProjectData,
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>
};

const EditProject: React.FC<ProjectModifyPageProps> = ({
  token,
  project_id,
  ProjectData,
  setProjectData
}) => {

  const navigate = useNavigate();

  const handleFieldChange = (fieldName: keyof ProjectData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent
  ) => {
    const value =
      'target' in event
        ? event.target.value
        : event;
    setProjectData({ ...ProjectData, [fieldName]: value as string });
  };

  const deleteProject = async () => {
    const message = await makeRequestFn(
      '/delete_project?project_id=' + project_id,
      'DELETE',
      undefined,
      token,
      undefined
    );
    toast.error('Project deleted successfully');
    navigate('/projects')
    console.log(message);
  };

  const isValidNumber = (value: string) => {
    const num = Number(value);
    return Number.isFinite(num);
  };
  const isValidInteger = (value: string) => {
    const num = Number(value);
    return Number.isInteger(num);
  };

  const editProject = async () => {
    if (ProjectData.title === '' ||
      ProjectData.description === '' ||
      ProjectData.budget === '' ||
      ProjectData.deadline === '' ||
      ProjectData.professional_num === '' ||
      ProjectData.category === '' ||
      ProjectData.status === '' ||
      ProjectData.project_location === '' || ProjectData.project_location === undefined) {
      toast.error('No fields can be left empty');
      return
    }
    if (!isValidNumber(ProjectData.budget)) {
      toast.error('Budget has to be a valid number')
      return
    }
    if (!isValidInteger(ProjectData.professional_num)) {
      toast.error('Number of professionals has to be a valid integer')
      return
    }
    if (ProjectData.professional_num !== '1') {
      ProjectData.project_type = 'Group'
    } else {
      ProjectData.project_type = 'Individual'
    }
    const body = {
      title: ProjectData.title,
      description: ProjectData.description,
      category: ProjectData.category,
      budget: ProjectData.budget,
      deadline: ProjectData.deadline,
      professional_num: ProjectData.professional_num,
      location: ProjectData.project_location,
      project_type: ProjectData.project_type,
      status: ProjectData.status,
      project_id: project_id
    };

    try {

      await makeRequestFn('/edit_project_detail', 'PUT', body, token, handleProjectEdit);

      await getProjectDetails()

      toast.success('Project edited successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  const handleProjectEdit = (data: any) => {
    setProjectData(data.project_data)
    console.log(ProjectData)
  };
  const getProjectDetails = async () => {
    try {
      await makeRequestFn('/view_project_detail?project_id=' + project_id, 'GET', undefined, token, handleDate);
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  const handleDate = (data: any) => {
    setProjectData(data)
    console.log(data)
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="auto"
    >
      <Grid container spacing={2} style={{ width: '80%' }}>
        <Grid item xs={12}>
          <TextField
            label="Project Title"
            value={ProjectData.title}
            onChange={handleFieldChange('title')}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Project Description"
            value={ProjectData.description}
            onChange={handleFieldChange('description')}
            multiline
            fullWidth
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Budget"
            value={ProjectData.budget}
            onChange={handleFieldChange('budget')}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Required # of Professionals"
            value={ProjectData.professional_num}
            onChange={handleFieldChange('professional_num')}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="date"
            value={ProjectData.deadline}
            onChange={handleFieldChange('deadline')}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            labelId="demo-multiple-name-label"
            label="category"
            style={{ width: '100%' }}
            value={ProjectData.category}
            onChange={handleFieldChange('category')}
          >
            {skillsDataSet.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Select
            label="project_location"
            style={{ width: '100%' }}
            value={ProjectData.project_location ?? 'Mixed'}
            onChange={handleFieldChange('project_location')}
          >
            <MenuItem value={'Remote'}>Remote</MenuItem>
            <MenuItem value={'On-Site'}>On-Site</MenuItem>
            <MenuItem value={'Mixed'}>Mixed</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12}>
          <RadioGroup
            aria-label="Status"
            name="status"
            value={ProjectData.status}
            onChange={handleFieldChange('status')}
          >
            <FormControlLabel value="open" control={<Radio />} label="Open" />
            <FormControlLabel
              value="archived"
              control={<Radio />}
              label="Archived"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="medium"
            variant="contained"
            style={{ width: '100%' }}
            onClick={editProject}
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button size="medium" variant="contained" style={{ width: '100%' }} onClick={() => { navigate('/projects') }}>
            Discard
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            size="medium"
            variant="contained"
            color="error"
            style={{ width: '100%' }}
            onClick={deleteProject}
          >
            Delete Project
          </Button >
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditProject;
