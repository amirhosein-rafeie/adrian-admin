import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { LeafletMapPicker } from '@/components/LeafletMapPicker';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST } from '@/share/constants';
import type { postAdminProjectsIdMediaRequestBodyFormData, putAdminProjectsIdRequestBodyJson } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { toJalaliDate } from '@/share/utils/date';

const OPTION_ITEMS: { label: string; value: NonNullable<putAdminProjectsIdRequestBodyJson['options']>[number] }[] = [
  { label: 'انباری', value: 'warehouse' },
  { label: 'سیستم گرمایشی', value: 'heating_system' },
  { label: 'سیستم سرمایشی', value: 'cooling_system' },
  { label: 'آسانسور', value: 'elevator' },
  { label: 'نیازی به آسانسور نیست', value: 'no_elevator_required' }
];

const schema = z.object({
  name: z.string().optional(), description: z.string().optional(), status: z.enum(['processing', 'finished']), address: z.string().optional(), price: z.string().optional(), price_currency: z.string().optional(), token_count: z.coerce.number(), token_name: z.string().optional(), start_time: z.string().optional(), dead_line: z.string().optional(), contractor: z.string().optional()
});
type FormValues = z.infer<typeof schema>;

const mediaTypeFromFile = (file: File): postAdminProjectsIdMediaRequestBodyFormData['media_type'] => {
  if (file.type.startsWith('image/')) return 'img';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return 'text';
};

export const EditProjectPage = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [latLng, setLatLng] = useState({ lat: 35.6892, lng: 51.389 });
  const [selectedOptions, setSelectedOptions] = useState<NonNullable<putAdminProjectsIdRequestBodyJson['options']>>([]);
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { status: 'processing', token_count: 1 } });
  const locationValue = useMemo(() => `${latLng.lat.toFixed(6)} ${latLng.lng.toFixed(6)}`, [latLng]);

  const { data } = useQuery({
    queryKey: [PROJECTS_LIST, 'edit', projectId],
    enabled: Number.isFinite(projectId),
    queryFn: () => clientRequest.GET('/admin/projects/{id}', { params: { path: { id: projectId } } })
  });

  useEffect(() => {
    const d: any = data?.data;
    if (!d?.project) return;
    const p = d.project;
    form.reset({ name: p.name ?? '', description: p.description ?? '', status: p.status ?? 'processing', address: p.address ?? '', price: p.price ?? '', price_currency: p.price_currency ?? 'IRR', token_count: p.token_count ?? 1, token_name: p.token_name ?? '', start_time: p.start_time ?? '', dead_line: p.dead_line ?? '', contractor: p.contractor ?? '' });
    const loc = String(p.location ?? '').split(' ');
    if (loc.length === 2) setLatLng({ lat: Number(loc[0]) || 35.6892, lng: Number(loc[1]) || 51.389 });
    setSelectedOptions((p.options ?? []) as NonNullable<putAdminProjectsIdRequestBodyJson['options']>);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => clientRequest.PUT('/admin/projects/{id}', { params: { path: { id: projectId } }, body: { ...values, location: locationValue, options: selectedOptions } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] }); notify('پروژه ویرایش شد'); }
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const files: File[] = [...images, ...(video ? [video] : []), ...(pdf ? [pdf] : [])];
      for (const file of files) {
        await clientRequest.POST('/admin/projects/{id}/media', { params: { path: { id: projectId } }, body: { file: file as unknown as string, name: file.name, media_type: mediaTypeFromFile(file) } });
      }
    },
    onSuccess: () => notify('فایل‌ها اضافه شدند')
  });

  return (
    <>
      <PageHeader title="ویرایش پروژه" subtitle="" />
      <Stack spacing={2} component="form" onSubmit={form.handleSubmit(async (v) => updateMutation.mutateAsync(v))}>
        <TextField label="نام پروژه" {...form.register('name')} />
        <TextField label="توضیحات" multiline minRows={2} {...form.register('description')} />
        <TextField select label="وضعیت" {...form.register('status')}><MenuItem value="processing">در حال پردازش</MenuItem><MenuItem value="finished">تکمیل‌شده</MenuItem></TextField>
        <TextField label="آدرس" {...form.register('address')} />
        <LeafletMapPicker lat={latLng.lat} lng={latLng.lng} onChange={(lat, lng) => setLatLng({ lat, lng })} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField label="Latitude" value={latLng.lat} onChange={(e) => setLatLng((p) => ({ ...p, lat: Number(e.target.value) || p.lat }))} /><TextField label="Longitude" value={latLng.lng} onChange={(e) => setLatLng((p) => ({ ...p, lng: Number(e.target.value) || p.lng }))} /><TextField label="Location" value={locationValue} InputProps={{ readOnly: true }} fullWidth /></Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField label="قیمت" {...form.register('price')} fullWidth /><TextField label="واحد قیمت" {...form.register('price_currency')} /></Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField type="number" label="تعداد توکن" {...form.register('token_count')} fullWidth /><TextField label="نام توکن" {...form.register('token_name')} fullWidth /></Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField type="date" label="تاریخ شروع" {...form.register('start_time')} InputLabelProps={{ shrink: true }} fullWidth helperText={`شمسی: ${toJalaliDate(form.watch('start_time'))}`} /><TextField type="date" label="ددلاین" {...form.register('dead_line')} InputLabelProps={{ shrink: true }} fullWidth helperText={`شمسی: ${toJalaliDate(form.watch('dead_line'))}`} /></Stack>
        <TextField label="پیمانکار" {...form.register('contractor')} />

        <Box><Typography mb={1} fontWeight={600}>امکانات پروژه</Typography><FormGroup>{OPTION_ITEMS.map((item) => <FormControlLabel key={item.value} control={<Checkbox checked={selectedOptions.includes(item.value)} onChange={(e) => setSelectedOptions((prev) => (e.target.checked ? [...prev, item.value] : prev.filter((i) => i !== item.value)))} />} label={item.label} />)}</FormGroup></Box>
        <Stack direction="row" spacing={1}><Button type="submit" variant="contained" disabled={updateMutation.isPending}>ذخیره</Button><Button variant="outlined" onClick={() => navigate('/projects')}>بازگشت</Button></Stack>

        <Box><Typography mb={1} fontWeight={600}>تصاویر پروژه (چند تصویر)</Typography><Button variant="outlined" component="label">انتخاب تصاویر<input hidden type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files ?? []))} /></Button></Box>
        <Box><Typography mb={1} fontWeight={600}>ویدیو پروژه (یک فایل)</Typography><Button variant="outlined" component="label">انتخاب ویدیو<input hidden type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} /></Button></Box>
        <Box><Typography mb={1} fontWeight={600}>PDF پروژه (یک فایل)</Typography><Button variant="outlined" component="label">انتخاب PDF<input hidden type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} /></Button></Box>
        <Button variant="contained" onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}>افزودن فایل‌ها</Button>
      </Stack>
    </>
  );
};
