import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';

interface Props {
  images: File[];
  video: File | null;
  pdf: File | null;
}

export const SelectedMediaPreview = ({ images, video, pdf }: Props) => {
  const imageUrls = useMemo(() => images.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })), [images]);
  const videoUrl = useMemo(() => (video ? URL.createObjectURL(video) : null), [video]);
  const pdfUrl = useMemo(() => (pdf ? URL.createObjectURL(pdf) : null), [pdf]);

  useEffect(() => () => {
    imageUrls.forEach((i) => URL.revokeObjectURL(i.url));
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [imageUrls, videoUrl, pdfUrl]);

  if (!images.length && !video && !pdf) return null;

  return (
    <Stack spacing={2}>
      {images.length ? (
        <Box>
          <Typography mb={1} fontWeight={600}>پیش‌نمایش تصاویر</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {imageUrls.map((img) => (
              <Box key={img.name} component="img" src={img.url} alt={img.name} sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
            ))}
          </Stack>
        </Box>
      ) : null}

      {videoUrl ? (
        <Box>
          <Typography mb={1} fontWeight={600}>پیش‌نمایش ویدیو</Typography>
          <Box component="video" src={videoUrl} controls sx={{ width: '100%', maxWidth: 420, borderRadius: 1 }} />
        </Box>
      ) : null}

      {pdfUrl ? (
        <Box>
          <Typography mb={1} fontWeight={600}>پیش‌نمایش PDF</Typography>
          <Box component="iframe" src={pdfUrl} sx={{ width: '100%', height: 360, border: 0, borderRadius: 1 }} />
        </Box>
      ) : null}
    </Stack>
  );
};
