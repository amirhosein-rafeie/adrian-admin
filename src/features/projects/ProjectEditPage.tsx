import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardContent, Checkbox, Chip, Divider, FormControlLabel, FormGroup, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { JalaliDateField } from '@/components/JalaliDateField';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useProjectDetail } from '@/features/projects/useProjectDetail';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST } from '@/share/constants';
import type { patchAdminProjectsIdRequestBodyJson, postAdminProjectsIdMediaRequestBodyFormData } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { gregorianToJalali, jalaliToGregorian } from '@/share/utils/jalaliDate';
import { resolveApiFileUrl } from '@/share/utils/fileUrl';

const optionalString = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}, z.string().optional());

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
  sale_price_per_meter: optionalString,
  token_price_toman: optionalString,
  price_per_meter_token: optionalString,
  estimated_profit_percentage: optionalString,
  start_time: z.string().min(1, 'تاریخ شروع الزامی است').refine((value) => Boolean(jalaliToGregorian(value)), 'فرمت تاریخ شروع معتبر نیست'),
  dead_line: z.string().min(1, 'ددلاین الزامی است').refine((value) => Boolean(jalaliToGregorian(value)), 'فرمت ددلاین معتبر نیست'),
  contractor: z.string().optional(),
  options: z.array(z.enum(['warehouse', 'heating_system', 'cooling_system', 'elevator', 'no_elevator_required'])).default([])
});

type FormValues = z.infer<typeof schema>;
type ExtendedPatchPayload = patchAdminProjectsIdRequestBodyJson & {
  sale_price_per_meter?: string | null;
  token_price_toman?: string | null;
  price_per_meter_token?: string | null;
  estimated_profit_percentage?: string | null;
};
type MediaType = 'img' | 'video' | 'pdf';
type ProjectMedia = { id?: number; path?: string; name?: string; media_type?: MediaType };

const projectOptions: { value: FormValues['options'][number]; label: string }[] = [
  { value: 'warehouse', label: 'انباری' },
  { value: 'heating_system', label: 'سیستم گرمایشی' },
  { value: 'cooling_system', label: 'سیستم سرمایشی' },
  { value: 'elevator', label: 'آسانسور' },
  { value: 'no_elevator_required', label: 'عدم نیاز به آسانسور' }
];

export const ProjectEditPage = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);

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
      sale_price_per_meter: '',
      token_price_toman: '',
      price_per_meter_token: '',
      estimated_profit_percentage: '',
      start_time: '',
      dead_line: '',
      contractor: '',
      options: []
    }
  });

  const { data, isPending } = useProjectDetail(projectId);

  useEffect(() => {
    const payload = data?.data as any;
    const project = payload?.project;
    if (!project) return;

    form.reset({
      name: project.name ?? '',
      description: project.description ?? '',
      status: project.status ?? 'processing',
      address: project.address ?? '',
      location: project.location ?? '',
      price: project.price ?? '',
      price_currency: project.price_currency ?? 'IRR',
      token_count: Number(project.token_count ?? 1),
      token_name: project.token_name ?? '',
      sale_price_per_meter: project.sale_price_per_meter ?? '',
      token_price_toman: project.token_price_toman ?? '',
      price_per_meter_token: project.price_per_meter_token ?? '',
      estimated_profit_percentage: project.estimated_profit_percentage ?? '',
      start_time: gregorianToJalali(project.start_time),
      dead_line: gregorianToJalali(project.dead_line),
      contractor: project.contractor ?? '',
      options: Array.isArray(project.options) ? project.options : []
    });

    setProjectMedia(Array.isArray(payload?.media) ? payload.media : []);
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: (values: ExtendedPatchPayload) =>
      clientRequest.PATCH('/admin/projects/{id}', {
        params: { path: { id: projectId } },
        body: values as patchAdminProjectsIdRequestBodyJson
      })
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ body }: { body: postAdminProjectsIdMediaRequestBodyFormData }) =>
      clientRequest.POST('/admin/projects/{id}/media', {
        params: { path: { id: projectId } },
        body
      })
  });

  const refreshProjectMedia = async () => {
    const res = await clientRequest.GET('/admin/projects/{id}', { params: { path: { id: projectId } } });
    const payload = res.data as any;
    setProjectMedia(Array.isArray(payload?.media) ? payload.media : []);
  };

  const handleUploadMedia = async (type: MediaType, files: FileList | null) => {
    try {
      if (!files?.length) return;
      const list = Array.from(files);
      for (const file of list) {
        const body = new FormData();
        body.append('file', file);
        body.append('media_type', type);
        body.append('name', file.name);

        await uploadMediaMutation.mutateAsync({ body: body as unknown as postAdminProjectsIdMediaRequestBodyFormData });
      }
      await refreshProjectMedia();
      await queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify('مدیا با موفقیت آپلود شد');
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  };

  const mediaByType = useMemo(
    () => ({
      img: projectMedia.filter((item) => item.media_type === 'img'),
      video: projectMedia.filter((item) => item.media_type === 'video'),
      pdf: projectMedia.filter((item) => item.media_type === 'pdf')
    }),
    [projectMedia]
  );

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        start_time: jalaliToGregorian(values.start_time),
        dead_line: jalaliToGregorian(values.dead_line)
      };

      await updateMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify('پروژه با موفقیت ویرایش شد');
      navigate('/projects');
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  });

  const renderMediaSection = (title: string, type: MediaType, accept: string) => (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight={700}>{title}</Typography>
          <Button variant="outlined" component="label" size="small" disabled={uploadMediaMutation.isPending || isPending}>
            افزودن فایل
            <input hidden type="file" accept={accept} multiple onChange={(e) => void handleUploadMedia(type, e.currentTarget.files)} />
          </Button>
        </Stack>

        {mediaByType[type].length === 0 ? (
          <Typography variant="body2" color="text.secondary">فایلی ثبت نشده است.</Typography>
        ) : (
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {mediaByType[type].map((item) => (
              <Paper key={`${item.id}-${item.path}`} variant="outlined" sx={{ p: 1, width: 180 }}>
                <Typography variant="caption" display="block" noWrap>{item.name ?? 'بدون نام'}</Typography>
                {type === 'img' ? (
                  <Box component="img" src={resolveApiFileUrl(item.path)} alt={item.name ?? 'media'} sx={{ mt: 1, width: '100%', height: 110, objectFit: 'cover', borderRadius: 1 }} />
                ) : type === 'video' ? (
                  <Box component="video" src={resolveApiFileUrl(item.path)} controls sx={{ mt: 1, width: '100%', height: 110, borderRadius: 1, backgroundColor: 'black' }} />
                ) : (
                  <Button href={resolveApiFileUrl(item.path)} target="_blank" rel="noreferrer" sx={{ mt: 1 }} size="small">مشاهده PDF</Button>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );

  return (
    <>
      <PageHeader title="ویرایش پروژه" subtitle={`ویرایش اطلاعات پروژه #${projectId}`} />
      <Card>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={onSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField label="نام پروژه" {...form.register('name')} error={!!form.formState.errors.name} helperText={form.formState.errors.name?.message} disabled={isPending} />
              <TextField select label="وضعیت" {...form.register('status')} disabled={isPending}>
                <MenuItem value="processing">در حال پردازش</MenuItem>
                <MenuItem value="finished">تکمیل‌شده</MenuItem>
              </TextField>
              <TextField label="آدرس" {...form.register('address')} error={!!form.formState.errors.address} helperText={form.formState.errors.address?.message} disabled={isPending} />
              <TextField label="پیمانکار" {...form.register('contractor')} error={!!form.formState.errors.contractor} helperText={form.formState.errors.contractor?.message} disabled={isPending} />
              <TextField label="قیمت" {...form.register('price')} error={!!form.formState.errors.price} helperText={form.formState.errors.price?.message} disabled={isPending} />
              <TextField label="واحد قیمت" {...form.register('price_currency')} error={!!form.formState.errors.price_currency} helperText={form.formState.errors.price_currency?.message} disabled={isPending} />
              <TextField type="number" label="تعداد توکن" {...form.register('token_count')} error={!!form.formState.errors.token_count} helperText={form.formState.errors.token_count?.message} disabled={isPending} />
              <TextField label="نام توکن" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} disabled={isPending} />
              <TextField label="قیمت فروش هر متر ملک" {...form.register('sale_price_per_meter')} error={!!form.formState.errors.sale_price_per_meter} helperText={form.formState.errors.sale_price_per_meter?.message ?? 'اختیاری'} disabled={isPending} />
              <TextField label="قیمت هر توکن (تومان)" {...form.register('token_price_toman')} error={!!form.formState.errors.token_price_toman} helperText={form.formState.errors.token_price_toman?.message ?? 'اختیاری'} disabled={isPending} />
              <TextField label="قیمت هر متر به توکن" {...form.register('price_per_meter_token')} error={!!form.formState.errors.price_per_meter_token} helperText={form.formState.errors.price_per_meter_token?.message ?? 'اختیاری'} disabled={isPending} />
              <TextField label="درصد سود پیش‌بینی‌شده" {...form.register('estimated_profit_percentage')} error={!!form.formState.errors.estimated_profit_percentage} helperText={form.formState.errors.estimated_profit_percentage?.message ?? 'اختیاری'} disabled={isPending} />
              <Controller
                name="start_time"
                control={form.control}
                render={({ field }) => (
                  <JalaliDateField
                    {...field}
                    label="تاریخ شروع (شمسی)"
                    placeholder="۱۴۰۴/۰۱/۱۵"
                    error={!!form.formState.errors.start_time}
                    helperText={form.formState.errors.start_time?.message ?? 'فرمت: YYYY/MM/DD'}
                    disabled={isPending}
                    inputProps={{ dir: 'ltr' }}
                  />
                )}
              />
              <Controller
                name="dead_line"
                control={form.control}
                render={({ field }) => (
                  <JalaliDateField
                    {...field}
                    label="ددلاین (شمسی)"
                    placeholder="۱۴۰۴/۱۲/۲۹"
                    error={!!form.formState.errors.dead_line}
                    helperText={form.formState.errors.dead_line?.message ?? 'فرمت: YYYY/MM/DD'}
                    disabled={isPending}
                    inputProps={{ dir: 'ltr' }}
                  />
                )}
              />
            </Box>

            <TextField label="موقعیت (lat lng)" {...form.register('location')} error={!!form.formState.errors.location} helperText={form.formState.errors.location?.message} disabled={isPending} />
            <TextField label="توضیحات" {...form.register('description')} error={!!form.formState.errors.description} helperText={form.formState.errors.description?.message} multiline minRows={3} disabled={isPending} />

            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={700}>امکانات پروژه</Typography>
              <Controller
                name="options"
                control={form.control}
                render={({ field }) => (
                  <FormGroup row>
                    {projectOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        control={(
                          <Checkbox
                            checked={field.value.includes(option.value)}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...field.value, option.value]
                                : field.value.filter((item) => item !== option.value);
                              field.onChange(next);
                            }}
                            disabled={isPending}
                          />
                        )}
                        label={option.label}
                      />
                    ))}
                  </FormGroup>
                )}
              />
            </Stack>

            <Divider textAlign="right">مدیاهای پروژه</Divider>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip label={`تصاویر: ${mediaByType.img.length}`} />
              <Chip label={`ویدیوها: ${mediaByType.video.length}`} />
              <Chip label={`PDFها: ${mediaByType.pdf.length}`} />
            </Stack>
            {renderMediaSection('تصاویر', 'img', 'image/*')}
            {renderMediaSection('ویدیوها', 'video', 'video/*')}
            {renderMediaSection('فایل‌های PDF', 'pdf', 'application/pdf')}

            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate('/projects')}>انصراف</Button>
              <Button type="submit" variant="contained" disabled={isPending || updateMutation.isPending}>ذخیره تغییرات</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
