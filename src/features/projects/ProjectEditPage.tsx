import { zodResolver } from '@hookform/resolvers/zod';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, FormGroup, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useProjectDetail } from '@/features/projects/useProjectDetail';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST } from '@/share/constants';
import type { patchAdminProjectsIdRequestBodyJson } from '@/share/utils/api/__generated__/types';
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
  contractor: z.string().optional(),
  options: z.array(z.enum(['warehouse', 'heating_system', 'cooling_system', 'elevator', 'no_elevator_required'])).default([])
});

type FormValues = z.infer<typeof schema>;

const projectOptions: { value: FormValues['options'][number]; label: string }[] = [
  { value: 'warehouse', label: 'انباری' },
  { value: 'heating_system', label: 'سیستم گرمایشی' },
  { value: 'cooling_system', label: 'سیستم سرمایشی' },
  { value: 'elevator', label: 'آسانسور' },
  { value: 'no_elevator_required', label: 'عدم نیاز به آسانسور' }
];

const normalizeDate = (value?: string | null) => {
  if (!value) return '';
  return value.length >= 10 ? value.slice(0, 10) : value;
};

export const ProjectEditPage = () => {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const startDateInputRef = useRef<HTMLInputElement | null>(null);
  const deadlineInputRef = useRef<HTMLInputElement | null>(null);

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
      contractor: '',
      options: []
    }
  });

  const { data, isPending } = useProjectDetail(projectId);

  useEffect(() => {
    const project = (data?.data as any)?.project;
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
      start_time: normalizeDate(project.start_time),
      dead_line: normalizeDate(project.dead_line),
      contractor: project.contractor ?? '',
      options: Array.isArray(project.options) ? project.options : []
    });
  }, [data, form]);

  const updateMutation = useMutation({
    mutationFn: (values: patchAdminProjectsIdRequestBodyJson) =>
      clientRequest.PATCH('/admin/projects/{id}', {
        params: { path: { id: projectId } },
        body: values
      })
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify('پروژه با موفقیت ویرایش شد');
      navigate('/projects');
    } catch (error) {
      notify((error as Error).message, 'error');
    }
  });

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
              <Controller
                name="start_time"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={(element) => {
                      field.ref(element);
                      startDateInputRef.current = element;
                    }}
                    type="date"
                    label="تاریخ شروع"
                    error={!!form.formState.errors.start_time}
                    helperText={form.formState.errors.start_time?.message}
                    InputLabelProps={{ shrink: true }}
                    disabled={isPending}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => startDateInputRef.current?.showPicker?.()} aria-label="بازکردن تقویم تاریخ شروع">
                            <CalendarMonthRoundedIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
              <Controller
                name="dead_line"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={(element) => {
                      field.ref(element);
                      deadlineInputRef.current = element;
                    }}
                    type="date"
                    label="ددلاین"
                    error={!!form.formState.errors.dead_line}
                    helperText={form.formState.errors.dead_line?.message}
                    InputLabelProps={{ shrink: true }}
                    disabled={isPending}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => deadlineInputRef.current?.showPicker?.()} aria-label="بازکردن تقویم ددلاین">
                            <CalendarMonthRoundedIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
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
