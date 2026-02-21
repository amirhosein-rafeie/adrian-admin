import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { auth } from '@/services/auth';
import type { post200AdminLoginResponseJson, postAdminLoginRequestBodyJson } from '@/share/utils/api/__generated__/types';

const schema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است')
});

type FormValues = z.infer<typeof schema>;

const login = async (body: postAdminLoginRequestBodyJson) => {
  const response = await fetch('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error?.error ?? 'ورود ناموفق بود');
    } catch {
      throw new Error('ورود ناموفق بود');
    }
  }

  const payload = (await response.json()) as post200AdminLoginResponseJson;

  if (!payload.access_token) {
    throw new Error('توکن دریافت نشد');
  }

  return payload;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      auth.setToken(data.access_token!);
      navigate('/', { replace: true });
    }
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper elevation={2} sx={{ width: '100%', maxWidth: 420, p: 3 }}>
        <Stack spacing={2} component="form" onSubmit={form.handleSubmit(async (values) => mutation.mutateAsync(values))}>
          <Typography variant="h5" fontWeight={700}>ورود ادمین</Typography>
          {mutation.isError ? <Alert severity="error">{mutation.error.message}</Alert> : null}
          <TextField label="نام کاربری" {...form.register('username')} error={!!form.formState.errors.username} helperText={form.formState.errors.username?.message} />
          <TextField type="password" label="رمز عبور" {...form.register('password')} error={!!form.formState.errors.password} helperText={form.formState.errors.password?.message} />
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            ورود
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};
