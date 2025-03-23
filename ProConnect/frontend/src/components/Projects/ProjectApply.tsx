import React, { useState } from 'react';
import { BACKEND_API_URL } from '../../apis/config';
import {
    Grid,
    Paper,
    Box,
    Typography,
    Button,
    TextField,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProjectApplyProps {
    token: string | null;
    pid: string | undefined | null;
}

const API_PROJECTAPPLY_URL = `${BACKEND_API_URL}/apply_project`;
const ProjectApply: React.FC<ProjectApplyProps> = ({ token, pid }) => {
    // const [bidAmount, setBidAmount] = useState<string | null>(null);
    const [ddl, setDdl] = useState<string | null>(null);
    const [proposal, setProposal] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleSubmit = () => {

        const applyData = {
            proposed_deadline: ddl,
            proposal: proposal,
            project_id: pid,
        };

        axios
        .post(API_PROJECTAPPLY_URL, applyData, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const data = response.data;
          toast.success('Apply successful!');
          navigate('/');
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    };

    return (
        <Grid container spacing={1} style={{ height: '80vh' }} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8}>
                <Paper elevation={3} style={{ width: '100%', height: '600px' }}>
                    <Box p={3} style={{ width: '100%', height: '100%' }}>
                        <Typography variant="h5" mb={2}>
                            Project Application
                        </Typography>
                        <TextField
                            fullWidth
                            label="I can deliver this on project by"
                            type="date"
                            variant="outlined"
                            value={ddl || ''}
                            onChange={(e) => setDdl(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ marginBottom: '15px' }}
                        />

                        <TextField
                            fullWidth
                            label="Proposal"
                            variant="outlined"
                            multiline
                            rows={8} 
                            value={proposal || ''}
                            placeholder="What makes you the best professional for this project"  
                            onChange={(e) => setProposal(e.target.value)}
                            style={{ marginBottom: '15px' }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: {
                                    height: '100%', 
                                    overflowY: 'auto' 
                                }
                            }}
                        />

                        <div style={{ textAlign: 'center' }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit Application
                            </Button>
                        </div>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ProjectApply;