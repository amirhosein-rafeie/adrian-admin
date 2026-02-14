import { Box, Typography } from '@mui/material';

export const EmptyState = ({ text = 'داده‌ای یافت نشد.' }: { text?: string }) => (
  <Box py={10} textAlign="center">
    <Typography variant="h6" color="text.secondary">
      {text}
    </Typography>
  </Box>
);
