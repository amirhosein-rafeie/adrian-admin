import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Chip, Divider, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST } from '@/share/constants';
import type { postAdminProjectsIdMediaRequestBodyFormData, postAdminProjectsRequestBodyJson } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

const schema = z.object({
  name: z.string().min(2, 'حداقل ۲ کاراکتر وارد کنید'),
  description: z.string().optional(),
  status: z.enum(['processing', 'finished']),
  address: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'),
  location: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'),
  price: z.string().min(1, 'قیمت الزامی است'),
  price_currency: z.string().min(1, 'واحد قیمت الزامی است'),
  token_count: z.coerce.number().min(1, 'تعداد توکن باید حداقل ۱ باشد'),
  token_name: z.string().min(2, 'نام توکن الزامی است'),
  start_time: z.string().min(1, 'تاریخ شروع الزامی است'),
  dead_line: z.string().min(1, 'ددلاین الزامی است'),
  contractor: z.string().optional()
});

type FormValues = z.infer<typeof schema>;
type MediaType = 'img' | 'video' | 'pdf';
type MediaPreview = { file: File; url: string };

const MediaUploadSection = ({
  title,
  helperText,
  accept,
  mediaType,
  files,
  onChange,
  onRemove,
  renderPreview
}: {
  title: string;
  helperText: string;
  accept: string;
  mediaType: MediaType;
  files: MediaPreview[];
  onChange: (type: MediaType, files: FileList | null) => void;
  onRemove: (type: MediaType, name: string) => void;
  renderPreview: (item: MediaPreview) => ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">{helperText}</Typography>
        </Box>
        <Button variant="outlined" component="label" size="small">
          انتخاب فایل
          <input hidden type="file" accept={accept} multiple onChange={(event) => onChange(mediaType, event.currentTarget.files)} />
        </Button>
      </Stack>

      {files.length === 0 ? (
        <Typography variant="body2" color="text.secondary">فایلی انتخاب نشده است.</Typography>
      ) : (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {files.map((item) => (
              <Chip key={item.file.name} label={item.file.name} onDelete={() => onRemove(mediaType, item.file.name)} />
            ))}
          </Stack>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {files.map((item) => (
              <Box key={`${item.file.name}-preview`} sx={{ width: 180 }}>
                {renderPreview(item)}
              </Box>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  </Paper>
);

export const ProjectCreatePage = () => {
  const [mediaFiles, setMediaFiles] = useState<Record<MediaType, File[]>>({ img: [], video: [], pdf: [] });
  const { notify } = useSnackbar();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'processing',
      address: '',
      location: '',
      price: '',
      price_currency: 'IRR',
      token_count: 1,
      token_name: '',
      start_time: '',
      dead_line: '',
      contractor: ''
    }
  });

  const imagePreviews = useMemo(
    () => mediaFiles.img.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [mediaFiles.img]
  );

  const videoPreviews = useMemo(
    () => mediaFiles.video.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [mediaFiles.video]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.url));
      videoPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [imagePreviews, videoPreviews]);

  const createMutation = useMutation({
    mutationFn: (values: postAdminProjectsRequestBodyJson) =>
      clientRequest.POST('/admin/projects', {
        body: values
      })
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ projectId, body }: { projectId: number; body: postAdminProjectsIdMediaRequestBodyFormData }) =>
      clientRequest.POST('/admin/projects/{id}/media', {
        params: { path: { id: projectId } },
        body
      })
  });

  const handleMediaChange = (type: MediaType, files: FileList | null) => {
    setMediaFiles((prev) => ({
      ...prev,
      [type]: files ? Array.from(files) : []
    }));
  };

  const handleRemoveMedia = (type: MediaType, fileName: string) => {
    setMediaFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((file) => file.name !== fileName)
    }));
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const createResult = (await createMutation.mutateAsync(values)) as { data?: { id?: number } };
      const projectId = createResult.data?.id;

      if (!projectId) {
        throw new Error('شناسه پروژه از سرور دریافت نشد');
      }

      const uploads = (Object.entries(mediaFiles) as Array<[MediaType, File[]]>).flatMap(([mediaType, files]) =>
        files.map((file) =>
          uploadMediaMutation.mutateAsync({
            projectId,
            body: {
              file: file as unknown as string,
              media_type: mediaType,
              name: file.name
            }
          })
        )
      );

      if (uploads.length > 0) {
        await Promise.all(uploads);
      }

      await queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify('پروژه با موفقیت ایجاد شد');
      navigate('/projects');
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  });

  return (
    <>
      <PageHeader title="ایجاد پروژه" subtitle="تمام اطلاعات پروژه و مدیا را در یک صفحه ثبت کنید" />
      <Card>
        <CardContent>
          <Stack spacing={2} component="form" onSubmit={handleSubmit}>
            <TextField label="نام پروژه" {...form.register('name')} error={!!form.formState.errors.name} helperText={form.formState.errors.name?.message} />
            <TextField label="توضیحات" {...form.register('description')} error={!!form.formState.errors.description} helperText={form.formState.errors.description?.message} multiline minRows={2} />
            <TextField select label="وضعیت" {...form.register('status')}>
              <MenuItem value="processing">در حال پردازش</MenuItem>
              <MenuItem value="finished">تکمیل‌شده</MenuItem>
            </TextField>
            <TextField label="آدرس" {...form.register('address')} error={!!form.formState.errors.address} helperText={form.formState.errors.address?.message} />
            <TextField label="مختصات (lat lng)" {...form.register('location')} error={!!form.formState.errors.location} helperText={form.formState.errors.location?.message} />
            <TextField label="قیمت" {...form.register('price')} error={!!form.formState.errors.price} helperText={form.formState.errors.price?.message} />
            <TextField label="واحد قیمت" {...form.register('price_currency')} error={!!form.formState.errors.price_currency} helperText={form.formState.errors.price_currency?.message} />
            <TextField type="number" label="تعداد توکن" {...form.register('token_count')} error={!!form.formState.errors.token_count} helperText={form.formState.errors.token_count?.message} />
            <TextField label="نام توکن" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} />
            <TextField type="date" label="تاریخ شروع" {...form.register('start_time')} error={!!form.formState.errors.start_time} helperText={form.formState.errors.start_time?.message} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="ددلاین" {...form.register('dead_line')} error={!!form.formState.errors.dead_line} helperText={form.formState.errors.dead_line?.message} InputLabelProps={{ shrink: true }} />
            <TextField label="پیمانکار" {...form.register('contractor')} error={!!form.formState.errors.contractor} helperText={form.formState.errors.contractor?.message} />

            <Divider textAlign="right">آپلود مدیا</Divider>

            <MediaUploadSection
              title="تصاویر پروژه"
              helperText="می‌توانید چند تصویر انتخاب کنید و پیش‌نمایش را ببینید."
              accept="image/*"
              mediaType="img"
              files={imagePreviews}
              onChange={handleMediaChange}
              onRemove={handleRemoveMedia}
              renderPreview={(item) => (
                <Box
                  component="img"
                  src={item.url}
                  alt={item.file.name}
                  sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                />
              )}
            />

            <MediaUploadSection
              title="ویدیوهای پروژه"
              helperText="می‌توانید چند ویدیو انتخاب کنید و پیش‌نمایش را ببینید."
              accept="video/*"
              mediaType="video"
              files={videoPreviews}
              onChange={handleMediaChange}
              onRemove={handleRemoveMedia}
              renderPreview={(item) => (
                <Box
                  component="video"
                  controls
                  src={item.url}
                  sx={{ width: '100%', height: 120, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'black' }}
                />
              )}
            />

            <MediaUploadSection
              title="PDFهای پروژه"
              helperText="برای PDF فقط نام فایل نمایش داده می‌شود."
              accept="application/pdf"
              mediaType="pdf"
              files={mediaFiles.pdf.map((file) => ({ file, url: '' }))}
              onChange={handleMediaChange}
              onRemove={handleRemoveMedia}
              renderPreview={() => null}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/projects')}>انصراف</Button>
              <Button type="submit" variant="contained" disabled={createMutation.isPending || uploadMediaMutation.isPending}>ثبت پروژه</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
