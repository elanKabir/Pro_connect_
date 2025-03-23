import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Rating,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

/**
 * A card component that displays information about a professional.
 * @param {string | null} avatarURL - The URL of the professional's avatar image.
 * @param {string} name - The name of the professional.
 * @param {string} bio - A short biography of the professional.
 * @param {string} location - The location of the professional.
 * @param {number} rating - The rating of the professional.
 * @param {boolean} recommended - Whether the professional is recommended or not.
 * @param {string} id - The ID of the professional.
 * @returns {JSX.Element} - A card displaying the professional's information.
 */
const ProfessionalListingCard = (props: {
  avatarURL: string | null;
  name: string;
  bio: string;
  location: string;
  rating: number;
  recommended: boolean;
  id: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        minWidth: 275,
        minHeight: 100,
        maxHeight: 325,
        boxShadow: props.recommended
          ? '0px 0px 10px 5px rgba(255, 215, 0, 0.5)'
          : null,
      }}
    >
      <CardActionArea
        onClick={() => {
          navigate(`/profile/${props.id}`);
        }}
      >
        <CardContent>
          <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Grid
              container
              item
              spacing={2}
              xs={12}
              sm={6}
              sx={{ alignItems: 'center' }}
            >
              <Grid item>
                {props.avatarURL ? (
                  <Avatar src={props.avatarURL} />
                ) : (
                  <Avatar>
                    {props.name.split(' ')[0][0] + props.name.split(' ')[1][0]}
                  </Avatar>
                )}
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div">
                  {props.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sm={3}
              sx={{ textAlign: { xs: 'left', sm: 'right' } }}
            >
              <Rating
                value={props.rating}
                readOnly
                precision={0.5}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color={'text.subtitle'}
                component="div"
                sx={{ textAlign: 'left' }}
              >
                {props.location}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body2" sx={{ minHeight: 60, marginTop: 2 }}>
            {props.bio.length > 345
              ? `${props.bio.substring(0, 345)}...`
              : props.bio}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProfessionalListingCard;
