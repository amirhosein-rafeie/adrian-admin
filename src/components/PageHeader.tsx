import { Box, Typography } from '@mui/material';

export const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={2} flexWrap="wrap">
    <Box>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
    </Box>
    {action}
  </Box>
);
