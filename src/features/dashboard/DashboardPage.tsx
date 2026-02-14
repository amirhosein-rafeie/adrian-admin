import { Card, CardContent, Grid, Typography } from '@mui/material';
import { PageHeader } from '@/components/PageHeader';
import { db } from '@/services/mockDb';

export const DashboardPage = () => {
  const stats = [
    { label: 'پروژه‌ها', value: db.projects.length },
    { label: 'توکن‌ها', value: db.tokens.length },
    { label: 'تراکنش‌ها', value: db.transactions.length },
    { label: 'سفارش‌ها', value: db.orders.length }
  ];

  return (
    <>
      <PageHeader title="داشبورد" subtitle="نمای کلی اطلاعات پنل مدیریت" />
      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{item.label}</Typography>
                <Typography variant="h4" mt={1}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
