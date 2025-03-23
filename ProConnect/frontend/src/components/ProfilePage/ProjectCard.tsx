import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Ribbon, RibbonContainer } from 'react-ribbons';
import { useNavigate } from 'react-router-dom';

const ProjectCard = (props: {
  title: string;
  description: string;
  dateCreated: string;
  projectOwner: string;
  projectID: string;
  status: string;
  professionals: string;
  projectType: string;
  projectLocation: string;
  projectCategory: string;
  // userRole: string;
}) => {
  // TODO: Add userRole to props, and add conditional rendering for Apply button
  const navigate = useNavigate();

  return (
    <>
      <Grid item xs={12}>
        <RibbonContainer>
          <Ribbon
            side="right"
            type="corner"
            size="normal"
            backgroundColor={
              props.status.toUpperCase() === 'OPEN'
                ? '#00cc66' // GREEN
                : props.status.toUpperCase() == 'COMPLETED'
                  ? '#ff0000' // RED
                  : props.status.toUpperCase() === 'ONGOING'
                    ? '#800080' // PURPLE
                    : props.status.toUpperCase() === 'ARCHIVED'
                      ? '#808080' // GREY
                      : '#000000' // BLACK (default color)
            }
            color="#ccffff"
            withStripes
          >
            {props.status.toUpperCase()}
          </Ribbon>
          <Card sx={{ display: 'flex', flexDirection: 'column', minWidth: '80vw',maxWidth:'80vw', minHeight: 250 }}>
            <CardContent>
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
              >
                <Grid item>
                  <Typography variant="h5" component="div">
                    {props.title}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
              >
                <Grid item>
                  <Typography color="text.secondary">
                    {props.projectOwner}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography color="text.secondary">
                    {props.dateCreated}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
              >
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    Location: {props.projectLocation}, Project Type:{' '}
                    {props.projectType}, Category: {props.projectCategory}
                  </Typography>
                </Grid>

                <Grid item>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PersonIcon />
                    <Typography variant="subtitle2" color="text.secondary">
                      {props.professionals}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Typography variant="body2" sx={{ minHeight: 60 }}>
                {props.description.length > 345
                  ? `${props.description.substring(0, 345)}...`
                  : props.description}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: 'flex-end',
                p: 2,
                mt: 'auto' // Push the actions to the bottom
              }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  navigate(`/project/${props.projectID}`);
                }}
              >
                Learn More
              </Button>
            </CardActions>
          </Card>
        </RibbonContainer>
      </Grid>
    </>
  );
};

export default ProjectCard;
