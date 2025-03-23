import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);




type cardProps = {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
  projectTitle: string,
  projectPostDate: string,
  projectStatus: string,
  projectBudget: string,
  user: User
}
type User = {
    uid: string;
    email: string;
    entityname: string;
    abn: string;
    role: string;
};


const ProfileRecentProjectCard: React.FC<cardProps> = ({
    onClick,
    projectTitle,
    projectPostDate,
    projectStatus,
    user,
    projectBudget
    }) => {

        const card = (
            <React.Fragment>
                <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {projectStatus}
                </Typography>
                <Typography variant="h5">
                    {projectTitle}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {projectPostDate}
                </Typography>
                </CardContent>
            </React.Fragment>
            );


    return (
      <Box>
        <Card variant="outlined"  onClick={onClick}  sx={{backgroundColor:'#2196f3'}}>{card}</Card>
      </Box>
    );
 };
export default ProfileRecentProjectCard
