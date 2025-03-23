import { Card, CardContent, Typography } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts';

/**
 * A card component for displaying dashboard information.
 * @param {string} title - The title of the card.
 * @param {number} count - The count to be displayed in the card.
 * @returns {JSX.Element} - A card component with the given title, count, and a sparkline chart.
 */
const DashboardCard = (props: { title: string; count: number }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {props.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.primary" variant="h3">
          {props.count}
        </Typography>
        <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
