import { Box, Stack, Typography } from '@mui/material';

export const PageHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2} mb={2}>
    <Box>
      <Typography variant="h5">{title}</Typography>
      {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
    </Box>
    {action}
  </Stack>
);
