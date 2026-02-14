import { Box, Typography } from '@mui/material';

export const EmptyState = ({ text = 'No data found.' }: { text?: string }) => (
  <Box py={10} textAlign="center">
    <Typography variant="h6" color="text.secondary">
      {text}
    </Typography>
  </Box>
);
