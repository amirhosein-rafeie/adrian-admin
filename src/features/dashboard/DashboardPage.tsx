import { Card, CardContent, Grid, Typography } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';

const cards = [
  { title: 'Total Projects', value: 2 },
  { title: 'Tokens', value: 2 },
  { title: 'Transactions', value: 2 },
  { title: 'Orders', value: 2 }
];

export const DashboardPage = () => (
  <>
    <PageHeader title="Dashboard" subtitle="Overview of platform metrics" />
    <Grid container spacing={2}>
      {cards.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.title}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">{item.title}</Typography>
              <Typography variant="h4" fontWeight={700}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </>
);
