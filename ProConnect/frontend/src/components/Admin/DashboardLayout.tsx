/**
 * A component that displays the dashboard layout for the admin page.
 */
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import React from 'react';
import DashboardCard from './DashboardCard';
import axios from 'axios';
import { BACKEND_API_URL } from '../../apis/config';
import { BarChart } from '@mui/x-charts';
import { toast } from 'react-toastify';

const API_STATS_URL = `${BACKEND_API_URL}/v1/admin/statistics`;

type userCount = {
  professionalUser: number;
  companyUser: number;
};
type userBarChart = {
  axisData: string[];
  professionalSeriesData: number[];
  companySeriesData: number[];
};

type projectCount = {
  archived: number;
  ongoing: number;
  completed: number;
  open: number;
};

type projectBarChart = {
  axisData: string[];
  archivedSeriesData: number[];
  ongoingSeriesData: number[];
  completedSeriesData: number[];
  openSeriesData: number[];
};

type reviewCount = {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
};

type reviewBarChart = {
  axisData: string[];
  oneStarSeriesData: number[];
  twoStarSeriesData: number[];
  threeStarSeriesData: number[];
  fourStarSeriesData: number[];
  fiveStarSeriesData: number[];
};

const DashboardLayout = () => {
  const [totalUser, setTotalUser] = React.useState<userCount>({
    professionalUser: 0,
    companyUser: 0,
  });
  const [totalProject, setTotalProject] = React.useState<projectCount>({
    archived: 0,
    ongoing: 0,
    completed: 0,
    open: 0,
  });
  const [totalReview, setTotalReview] = React.useState<reviewCount>({
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  });
  const [userBarChart, setUserBarChart] = React.useState<userBarChart>({
    axisData: ['yearMonth'],
    professionalSeriesData: [0],
    companySeriesData: [0],
  });
  const [projectBarChart, setProjectBarChart] = React.useState<projectBarChart>(
    {
      axisData: ['yearMonth'],
      archivedSeriesData: [0],
      ongoingSeriesData: [0],
      completedSeriesData: [0],
      openSeriesData: [0],
    }
  );
  const [reviewBarChart, setReviewBarChart] = React.useState<reviewBarChart>({
    axisData: ['yearMonth'],
    oneStarSeriesData: [0],
    twoStarSeriesData: [0],
    threeStarSeriesData: [0],
    fourStarSeriesData: [0],
    fiveStarSeriesData: [0],
  });

  React.useEffect(() => {
    axios
      .get(API_STATS_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const data = response.data.data;
        const userCount = data.user.total_users;
        const userBarChart = data.user.users_creation_date;
        const projectCount = data.project.total_projects;
        const projectBarChart = data.project.projects_creation_date;
        const reviewCount = data.review.total_reviews;
        const reviewBarChart = data.review.reviews_creation_date;

        setTotalUser({
          professionalUser: userCount['30'],
          companyUser: userCount['20'],
        });

        setUserBarChart({
          axisData: userBarChart['20'].xAxis,
          professionalSeriesData: userBarChart['30'].series,
          companySeriesData: userBarChart['20'].series,
        });
        setTotalProject({
          archived: projectCount.archived,
          ongoing: projectCount.ongoing,
          completed: projectCount.completed,
          open: projectCount.open,
        });
        setProjectBarChart({
          axisData: projectBarChart.archived.xAxis,
          archivedSeriesData: projectBarChart.archived.series,
          ongoingSeriesData: projectBarChart.ongoing.series,
          completedSeriesData: projectBarChart.completed.series,
          openSeriesData: projectBarChart.open.series,
        });
        setTotalReview({
          oneStar: reviewCount['1'] || 0,
          twoStar: reviewCount['2'] || 0,
          threeStar: reviewCount['3'] || 0,
          fourStar: reviewCount['4'] || 0,
          fiveStar: reviewCount['5'] || 0,
        });
        setReviewBarChart({
          axisData: reviewBarChart['1']
            ? reviewBarChart['1'].xAxis
            : reviewBarChart['2']
            ? reviewBarChart['2'].xAxis
            : reviewBarChart['3']
            ? reviewBarChart['3'].xAxis
            : reviewBarChart['4']
            ? reviewBarChart['4'].xAxis
            : reviewBarChart['5'].xAxis,
          oneStarSeriesData: reviewBarChart['1']?.series ?? [0],
          twoStarSeriesData: reviewBarChart['2']?.series ?? [0],
          threeStarSeriesData: reviewBarChart['3']?.series ?? [0],
          fourStarSeriesData: reviewBarChart['4']?.series ?? [0],
          fiveStarSeriesData: reviewBarChart['5']?.series ?? [0],
        });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid container item spacing={2}>
        <Grid item xs={12} sm={4} md={4}>
          <DashboardCard
            title="Users"
            count={totalUser.companyUser + totalUser.professionalUser}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <DashboardCard
            title="Projects"
            count={
              totalProject.archived +
              totalProject.completed +
              totalProject.ongoing +
              totalProject.open
            }
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <DashboardCard
            title="Reviews"
            count={
              totalReview.fiveStar +
              totalReview.fourStar +
              totalReview.threeStar +
              totalReview.twoStar +
              totalReview.oneStar
            }
          />
        </Grid>
      </Grid>

      <Card sx={{ margin: 2 }}>
        <CardContent>
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Users
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: totalUser.companyUser,
                        label: 'Company User',
                      },
                      {
                        id: 1,
                        value: totalUser.professionalUser,
                        label: 'Professinal User',
                      },
                    ],
                  },
                ]}
                height={250}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: userBarChart.axisData }]}
                series={[
                  {
                    label: 'Professional',
                    data: userBarChart.professionalSeriesData,
                  },
                  { label: 'Company', data: userBarChart.companySeriesData },
                ]}
                height={250}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ margin: 2 }}>
        <CardContent>
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Projects
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: totalProject.archived,
                        label: 'Archived',
                      },
                      {
                        id: 1,
                        value: totalProject.completed,
                        label: 'Completed',
                      },
                      {
                        id: 2,
                        value: totalProject.ongoing,
                        label: 'Ongoing',
                      },
                      {
                        id: 3,
                        value: totalProject.open,
                        label: 'Open',
                      },
                    ],
                  },
                ]}
                height={250}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: projectBarChart.axisData }]}
                series={[
                  {
                    label: 'Archived',
                    data: projectBarChart.archivedSeriesData,
                  },
                  { label: 'Open', data: projectBarChart.openSeriesData },
                  {
                    label: 'Completed',
                    data: projectBarChart.completedSeriesData,
                  },
                  { label: 'Ongoing', data: projectBarChart.ongoingSeriesData },
                ]}
                height={250}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ margin: 2 }}>
        <CardContent>
          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Reviews
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: totalReview.oneStar,
                        label: '1 Star',
                      },
                      {
                        id: 1,
                        value: totalReview.twoStar,
                        label: '2 Star',
                      },
                      {
                        id: 2,
                        value: totalReview.threeStar,
                        label: '3 Star',
                      },
                      {
                        id: 3,
                        value: totalReview.fourStar,
                        label: '4 Star',
                      },
                      {
                        id: 4,
                        value: totalReview.fiveStar,
                        label: '5 Star',
                      },
                    ],
                  },
                ]}
                height={300}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart
                xAxis={[{ scaleType: 'band', data: reviewBarChart.axisData }]}
                series={[
                  { data: reviewBarChart.oneStarSeriesData, label: '1 Star' },
                  { data: reviewBarChart.twoStarSeriesData, label: '2 Star' },
                  { data: reviewBarChart.threeStarSeriesData, label: '3 Star' },
                  { data: reviewBarChart.fourStarSeriesData, label: '4 Star' },
                  { data: reviewBarChart.fiveStarSeriesData, label: '5 Star' },
                ]}
                height={300}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DashboardLayout;
