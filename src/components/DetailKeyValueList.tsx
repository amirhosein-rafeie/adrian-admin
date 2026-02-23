import { Chip, Paper, Stack, Typography } from '@mui/material';

type DetailKeyValueListProps = {
  data: Record<string, unknown> | null | undefined;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

export const DetailKeyValueList = ({ data }: DetailKeyValueListProps) => {
  if (!data) {
    return <Typography color="text.secondary">داده‌ای برای نمایش وجود ندارد.</Typography>;
  }

  return (
    <Stack spacing={1.25}>
      {Object.entries(data).map(([key, value]) => (
        <Paper key={key} variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
          <Stack spacing={0.75}>
            <Chip label={key} size="small" sx={{ alignSelf: 'flex-start', fontWeight: 700 }} />
            <Typography component="pre" variant="body2" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
              {formatValue(value)}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};
