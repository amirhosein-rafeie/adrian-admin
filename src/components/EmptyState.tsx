import { Box, Typography } from '@mui/material';

export const EmptyState = ({ title }: { title: string }) => (
  <Box py={6} textAlign="center">
    <Typography variant="h6">{title}</Typography>
    <Typography color="text.secondary">Try adjusting your filters or creating new data.</Typography>
  </Box>
);
