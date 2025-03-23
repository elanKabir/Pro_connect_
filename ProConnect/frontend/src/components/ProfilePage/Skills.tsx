import React, { useEffect, useState } from 'react';
import { Button, TextField, Chip, Grid, Box } from '@mui/material';
import makeRequestFn from '../../apis/makeRequest';
import { ProfilePageObject, Setters } from '../../apis/types';
import { toast } from 'react-toastify';

interface SkillProps {
    ProfilePageObject: ProfilePageObject
    Setters: Setters
}

const SkillsInput: React.FC<SkillProps> = ({ ProfilePageObject, Setters }) => {
    const [skill, setSkill] = useState<string>('');
    const [skills, setSkillsList] = useState<string[]>([]);

    const handleAddSkill = async () => {
        if (skill && !skills.includes(skill)) {
            const body = {
                user_id: ProfilePageObject.user_id,
                skills: skill
            }
            try {
                await makeRequestFn('/add_skill', 'POST', body, ProfilePageObject.token, fetchSkillsList);
                toast.success('New Skill has been added')
            } catch (error: any) {
                toast.error('Error occured when adding new skill')
            }
            setSkill('');
        }
    };
    const fetchSkillsList = () => {
        makeRequestFn('/list_skills?user_id=' + ProfilePageObject.user_id, 'GET', undefined, ProfilePageObject.token, updateSkillsList);
    }
    const updateSkillsList = (data: any) => {
        Setters.setUserDetail(previousVales => ({ ...previousVales, skills: data['skill list'] }))
        setSkillsList(data['skill list']);
    }
    useEffect(() => {
        setSkillsList(ProfilePageObject.userDetails.skills)
    }, [ProfilePageObject.token, ProfilePageObject.user_id, ProfilePageObject.user, ProfilePageObject.userDetails]);
    return (
        <Box>
            <Grid container spacing={1} alignItems='center' justifyContent='center' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Grid item xs={12}  >
                    {ProfilePageObject.isUsersProfile && (
                        <>
                            <TextField
                                variant="outlined"
                                label="Enter a skill"
                                fullWidth
                                value={skill}
                                onChange={e => setSkill(e.target.value)}
                                style={{ marginRight: '5px' }}
                            />
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Button sx={{ mt: 2 }} variant="contained" color="primary" onClick={handleAddSkill}>
                                    Add Skill
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }} >
                    {skills.map((s, index) => (
                        <Chip key={s} title={s} sx={{ display: 'inline-flex', margin: 0.5, fontSize: 16 }} label={s} variant="outlined" />
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SkillsInput;


