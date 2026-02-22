import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { LeafletMapPicker } from '@/components/LeafletMapPicker';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST } from '@/share/constants';
import type { postAdminProjectsIdMediaRequestBodyFormData, postAdminProjectsRequestBodyJson } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

const OPTION_ITEMS: { label: string; value: NonNullable<postAdminProjectsRequestBodyJson['options']>[number] }[] = [
  { label: 'انباری', value: 'warehouse' },
  { label: 'سیستم گرمایشی', value: 'heating_system' },
  { label: 'سیستم سرمایشی', value: 'cooling_system' },
  { label: 'آسانسور', value: 'elevator' },
  { label: 'نیازی به آسانسور نیست', value: 'no_elevator_required' }
];

const schema = z.object({
  name: z.string().min(2, 'حداقل ۲ کاراکتر وارد کنید'),
  description: z.string().optional(),
  status: z.enum(['processing', 'finished']),
  address: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'),
  price: z.string().min(1, 'قیمت الزامی است'),
  price_currency: z.string().min(1, 'واحد قیمت الزامی است'),
  token_count: z.coerce.number().min(1, 'تعداد توکن باید حداقل ۱ باشد'),
  token_name: z.string().min(2, 'نام توکن الزامی است'),
  start_time: z.string().min(1, 'تاریخ شروع الزامی است'),
  dead_line: z.string().min(1, 'ددلاین الزامی است'),
  contractor: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const mediaTypeFromFile = (file: File): postAdminProjectsIdMediaRequestBodyFormData['media_type'] => {
  if (file.type.startsWith('image/')) return 'img';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('audio/')) return 'voice';
  return 'text';
};

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [latLng, setLatLng] = useState({ lat: 35.6892, lng: 51.389 });
  const [selectedOptions, setSelectedOptions] = useState<NonNullable<postAdminProjectsRequestBodyJson['options']>>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const locationValue = useMemo(() => `${latLng.lat.toFixed(6)} ${latLng.lng.toFixed(6)}`, [latLng]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'processing',
      address: '',
      price: '',
      price_currency: 'IRR',
      token_count: 1,
      token_name: '',
      start_time: '',
      dead_line: '',
      contractor: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await clientRequest.POST('/admin/projects', {
        body: {
          ...values,
          location: locationValue,
          options: selectedOptions.length ? selectedOptions : undefined,
          description: values.description || null,
          contractor: values.contractor || null
        }
      });

      const project = response.data;
      const projectId = project?.id;
      if (!projectId) return;

      const files: File[] = [...images, ...(video ? [video] : []), ...(pdf ? [pdf] : [])];

      for (const file of files) {
        await clientRequest.POST('/admin/projects/{id}/media', {
          params: { path: { id: projectId } },
          body: {
            file: file as unknown as string,
            name: file.name,
            media_type: mediaTypeFromFile(file)
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify('پروژه با موفقیت ساخته شد');
      navigate('/projects');
    },
    onError: (error: Error) => {
      notify(error.message || 'خطا در ساخت پروژه', 'error');
    }
  });

  return (
    <>
      <PageHeader title="ایجاد پروژه" subtitle="" />
      <Stack spacing={2} component="form" onSubmit={form.handleSubmit(async (values) => createMutation.mutateAsync(values))}>
        <TextField label="نام پروژه" {...form.register('name')} error={!!form.formState.errors.name} helperText={form.formState.errors.name?.message} />
        <TextField label="توضیحات" multiline minRows={2} {...form.register('description')} />
        <TextField select label="وضعیت" {...form.register('status')}>
          <MenuItem value="processing">در حال پردازش</MenuItem>
          <MenuItem value="finished">تکمیل‌شده</MenuItem>
        </TextField>
        <TextField label="آدرس" {...form.register('address')} error={!!form.formState.errors.address} helperText={form.formState.errors.address?.message} />

        <LeafletMapPicker lat={latLng.lat} lng={latLng.lng} onChange={(lat, lng) => setLatLng({ lat, lng })} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Latitude" value={latLng.lat} onChange={(e) => setLatLng((p) => ({ ...p, lat: Number(e.target.value) || p.lat }))} />
          <TextField label="Longitude" value={latLng.lng} onChange={(e) => setLatLng((p) => ({ ...p, lng: Number(e.target.value) || p.lng }))} />
          <TextField label="Location" value={locationValue} InputProps={{ readOnly: true }} fullWidth />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="قیمت" {...form.register('price')} error={!!form.formState.errors.price} helperText={form.formState.errors.price?.message} fullWidth />
          <TextField label="واحد قیمت" {...form.register('price_currency')} error={!!form.formState.errors.price_currency} helperText={form.formState.errors.price_currency?.message} sx={{ minWidth: 180 }} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField type="number" label="تعداد توکن" {...form.register('token_count')} error={!!form.formState.errors.token_count} helperText={form.formState.errors.token_count?.message} fullWidth />
          <TextField label="نام توکن" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} fullWidth />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField type="date" label="تاریخ شروع" {...form.register('start_time')} InputLabelProps={{ shrink: true }} error={!!form.formState.errors.start_time} helperText={form.formState.errors.start_time?.message} fullWidth />
          <TextField type="date" label="ددلاین" {...form.register('dead_line')} InputLabelProps={{ shrink: true }} error={!!form.formState.errors.dead_line} helperText={form.formState.errors.dead_line?.message} fullWidth />
        </Stack>

        <TextField label="پیمانکار" {...form.register('contractor')} />

        <Box>
          <Typography mb={1} fontWeight={600}>امکانات پروژه</Typography>
          <FormGroup>
            {OPTION_ITEMS.map((item) => (
              <FormControlLabel
                key={item.value}
                control={<Checkbox checked={selectedOptions.includes(item.value)} onChange={(e) => setSelectedOptions((prev) => (e.target.checked ? [...prev, item.value] : prev.filter((i) => i !== item.value)))} />}
                label={item.label}
              />
            ))}
          </FormGroup>
        </Box>

        <Box>
          <Typography mb={1} fontWeight={600}>تصاویر پروژه (چند تصویر)</Typography>
          <Button variant="outlined" component="label">
            انتخاب تصاویر
            <input hidden type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files ?? []))} />
          </Button>
          <Stack mt={1} spacing={0.5}>{images.map((file) => <Typography key={file.name} variant="body2">• {file.name}</Typography>)}</Stack>
        </Box>

        <Box>
          <Typography mb={1} fontWeight={600}>ویدیو پروژه (یک فایل)</Typography>
          <Button variant="outlined" component="label">
            انتخاب ویدیو
            <input hidden type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
          </Button>
          <Typography mt={1} variant="body2" color="text.secondary">{video?.name ?? 'فایلی انتخاب نشده است.'}</Typography>
        </Box>

        <Box>
          <Typography mb={1} fontWeight={600}>فایل PDF پروژه (یک فایل)</Typography>
          <Button variant="outlined" component="label">
            انتخاب PDF
            <input hidden type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
          </Button>
          <Typography mt={1} variant="body2" color="text.secondary">{pdf?.name ?? 'فایلی انتخاب نشده است.'}</Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>ساخت پروژه</Button>
          <Button variant="outlined" onClick={() => navigate('/projects')}>انصراف</Button>
        </Stack>
      </Stack>
    </>
  );
};
