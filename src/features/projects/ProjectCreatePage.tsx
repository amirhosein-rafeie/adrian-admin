import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import moment, { Moment } from "moment-jalaali";
import CustomDatePicker from "@/components/CustomDatePicker";
import { PageHeader } from "@/components/PageHeader";
import { useSnackbar } from "@/hooks/useSnackbar";
import { queryClient } from "@/services/queryClient";
import { PROJECTS_LIST } from "@/share/constants";
import type {
  postAdminProjectsIdMediaRequestBodyFormData,
  postAdminProjectsRequestBodyJson,
} from "@/share/utils/api/__generated__/types";
import { clientRequest } from "@/share/utils/api/clientRequest";
import { jalaliToGregorian } from "@/share/utils/jalaliDate";

const optionalString = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return value;
}, z.string().optional());

const schema = z.object({
  name: z.string().min(2, "حداقل ۲ کاراکتر وارد کنید"),
  description: z.string().optional(),
  status: z.enum(["processing", "finished"]),
  address: z.string().min(3, "حداقل ۳ کاراکتر وارد کنید"),
  location: z.string().min(3, "حداقل ۳ کاراکتر وارد کنید"),
  price: z.string().min(1, "قیمت الزامی است"),
  price_currency: z.string().min(1, "واحد قیمت الزامی است"),
  token_count: z.coerce.number().min(1, "تعداد توکن باید حداقل ۱ باشد"),
  token_sold: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return value;
  }, z.coerce.number().min(0, "تعداد توکن فروخته‌شده نمی‌تواند منفی باشد").optional()),
  token_name: z.string().min(2, "نام توکن الزامی است"),
  sale_price_per_meter: optionalString,
  token_price_toman: optionalString,
  price_per_meter_token: optionalString,
  estimated_profit_percentage: optionalString,
  start_time: z
    .string()
    .min(1, "تاریخ شروع الزامی است")
    .refine(
      (value) => Boolean(jalaliToGregorian(value)),
      "فرمت تاریخ شروع معتبر نیست",
    ),
  dead_line: z
    .string()
    .min(1, "ددلاین الزامی است")
    .refine(
      (value) => Boolean(jalaliToGregorian(value)),
      "فرمت ددلاین معتبر نیست",
    ),
  contractor: z.string().optional(),
  options: z
    .array(
      z.enum([
        "warehouse",
        "heating_system",
        "cooling_system",
        "elevator",
        "no_elevator_required",
      ]),
    )
    .default([]),
});

type FormValues = z.infer<typeof schema>;
type ExtendedProjectPayload = postAdminProjectsRequestBodyJson & {
  sale_price_per_meter?: string;
  token_price_toman?: string;
  price_per_meter_token?: string;
  estimated_profit_percentage?: string;
};

type MediaType = "img" | "video" | "pdf";
type MediaPreview = { file: File; url: string };

const steps = ["اطلاعات پایه پروژه", "افزودن مدیا به پروژه"];
const projectOptions: {
  value: FormValues["options"][number];
  label: string;
}[] = [
  { value: "warehouse", label: "انباری" },
  { value: "heating_system", label: "سیستم گرمایشی" },
  { value: "cooling_system", label: "سیستم سرمایشی" },
  { value: "elevator", label: "آسانسور" },
  { value: "no_elevator_required", label: "عدم نیاز به آسانسور" },
];

const parseLocation = (value: string): { lat: number; lng: number } | null => {
  const [latRaw, lngRaw] = value.trim().split(/\s+/);
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return null;
};

const MapLocationPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const fallback = parseLocation(value) ?? { lat: 35.6892, lng: 51.389 };

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapElementRef.current) return;

      if (!(window as any).L) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("لود نقشه ناموفق بود"));
          document.body.appendChild(script);
        });
      }

      if (!mounted || !(window as any).L) return;

      const L = (window as any).L;
      mapRef.current = L.map(mapElementRef.current).setView(
        [fallback.lat, fallback.lng],
        13,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      markerRef.current = L.marker([fallback.lat, fallback.lng]).addTo(
        mapRef.current,
      );
      mapRef.current.on("click", (event: any) => {
        const { lat, lng } = event.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onChange(`${lat.toFixed(6)} ${lng.toFixed(6)}`);
      });
    };

    void initMap();

    return () => {
      mounted = false;
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const parsed = parseLocation(value);
    if (!parsed || !mapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([parsed.lat, parsed.lng]);
    mapRef.current.setView([parsed.lat, parsed.lng], mapRef.current.getZoom());
  }, [value]);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          انتخاب لوکیشن روی نقشه
        </Typography>
        <Typography variant="caption" color="text.secondary">
          روی نقشه کلیک کنید تا مختصات در فرم ثبت شود.
        </Typography>
        <Box
          ref={mapElementRef}
          sx={{
            width: "100%",
            height: 320,
            borderRadius: 1,
            overflow: "hidden",
          }}
        />
      </Stack>
    </Paper>
  );
};

const MediaUploadSection = ({
  title,
  helperText,
  accept,
  mediaType,
  files,
  onChange,
  onRemove,
  renderPreview,
  disabled,
}: {
  title: string;
  helperText: string;
  accept: string;
  mediaType: MediaType;
  files: MediaPreview[];
  onChange: (type: MediaType, files: FileList | null) => void;
  onRemove: (type: MediaType, name: string) => void;
  renderPreview: (item: MediaPreview) => ReactNode;
  disabled?: boolean;
}) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {helperText}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          component="label"
          size="small"
          disabled={disabled}
        >
          انتخاب فایل
          <input
            hidden
            type="file"
            accept={accept}
            multiple
            onChange={(event) => onChange(mediaType, event.currentTarget.files)}
          />
        </Button>
      </Stack>

      {files.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          فایلی انتخاب نشده است.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {files.map((item) => (
              <Chip
                key={`${item.file.name}-${item.file.lastModified}`}
                label={item.file.name}
                onDelete={() => onRemove(mediaType, item.file.name)}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
            {files.map((item) => (
              <Box
                key={`${item.file.name}-${item.file.lastModified}-preview`}
                sx={{ width: 180 }}
              >
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
  const [activeStep, setActiveStep] = useState(0);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  const [mediaFiles, setMediaFiles] = useState<Record<MediaType, File[]>>({
    img: [],
    video: [],
    pdf: [],
  });
  const { notify } = useSnackbar();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "processing",
      address: "",
      location: "35.689200 51.389000",
      price: "",
      price_currency: "IRR",
      token_count: 1,
      token_sold: 0,
      token_name: "",
      sale_price_per_meter: "",
      token_price_toman: "",
      price_per_meter_token: "",
      estimated_profit_percentage: "",
      start_time: "",
      dead_line: "",
      contractor: "",
      options: [],
    },
  });

  const locationValue = form.watch("location");
  const imagePreviews = useMemo(
    () =>
      mediaFiles.img.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [mediaFiles.img],
  );
  const videoPreviews = useMemo(
    () =>
      mediaFiles.video.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [mediaFiles.video],
  );

  useEffect(
    () => () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.url));
      videoPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [imagePreviews, videoPreviews],
  );

  const createMutation = useMutation({
    mutationFn: (values: ExtendedProjectPayload) =>
      clientRequest.POST("/admin/projects", {
        body: values as postAdminProjectsRequestBodyJson,
      }),
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({
      projectId,
      body,
    }: {
      projectId: number;
      body: postAdminProjectsIdMediaRequestBodyFormData;
    }) =>
      clientRequest.POST("/admin/projects/{id}/media", {
        params: { path: { id: projectId } },
        body,
      }),
  });

  const uploadSelectedFiles = async (
    type: MediaType,
    files: FileList | null,
  ) => {
    try {
      if (!createdProjectId) throw new Error("ابتدا پروژه را ایجاد کنید");
      if (!files || files.length === 0) return;

      const fileList = Array.from(files);
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("media_type", type);
        formData.append("MediaType", type);
        formData.append("name", file.name);

        await uploadMediaMutation.mutateAsync({
          projectId: createdProjectId,
          body: formData as unknown as postAdminProjectsIdMediaRequestBodyFormData,
        });

        setMediaFiles((prev) => ({ ...prev, [type]: [...prev[type], file] }));
      }

      await queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      notify(
        `${fileList.length} فایل ${type === "img" ? "تصویر" : type === "video" ? "ویدیو" : "PDF"} آپلود شد`,
      );
    } catch (error) {
      notify((error as Error).message, "error");
    }
  };

  const handleMediaChange = (type: MediaType, files: FileList | null) => {
    void uploadSelectedFiles(type, files);
  };

  const handleRemoveMedia = (type: MediaType, fileName: string) => {
    setMediaFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((file) => file.name !== fileName),
    }));
  };

  const handleCreateProject = form.handleSubmit(async (values) => {
    try {
      const payload = {
        ...values,
        start_time: jalaliToGregorian(values.start_time),
        dead_line: jalaliToGregorian(values.dead_line),
      };

      const createResult = (await createMutation.mutateAsync(payload)) as {
        data?: { id?: number };
      };
      const projectId = createResult.data?.id;
      if (!projectId) throw new Error("شناسه پروژه از سرور دریافت نشد");

      setCreatedProjectId(projectId);
      setActiveStep(1);
      notify(
        "پروژه ایجاد شد، حالا مدیاها را انتخاب کنید تا لحظه‌ای آپلود شوند",
      );
    } catch (error) {
      notify((error as Error).message, "error");
    }
  });

  return (
    <>
      <PageHeader
        title="ایجاد پروژه"
        subtitle="اول پروژه ساخته می‌شود، سپس مدیاها لحظه‌ای و دونه‌دونه اضافه می‌شوند"
      />
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Stack
                spacing={3}
                component="form"
                onSubmit={handleCreateProject}
              >
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      اطلاعات پایه
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="نام پروژه"
                        {...form.register("name")}
                        error={!!form.formState.errors.name}
                        helperText={form.formState.errors.name?.message}
                      />
                      <TextField
                        select
                        label="وضعیت"
                        {...form.register("status")}
                      >
                        <MenuItem value="processing">در حال پردازش</MenuItem>
                        <MenuItem value="finished">تکمیل‌شده</MenuItem>
                      </TextField>
                      <TextField
                        label="آدرس"
                        {...form.register("address")}
                        error={!!form.formState.errors.address}
                        helperText={form.formState.errors.address?.message}
                      />
                      <TextField
                        label="پیمانکار"
                        {...form.register("contractor")}
                        error={!!form.formState.errors.contractor}
                        helperText={form.formState.errors.contractor?.message}
                      />
                      <TextField
                        label="قیمت"
                        {...form.register("price")}
                        error={!!form.formState.errors.price}
                        helperText={form.formState.errors.price?.message}
                      />
                      <TextField
                        label="واحد قیمت"
                        {...form.register("price_currency")}
                        error={!!form.formState.errors.price_currency}
                        helperText={
                          form.formState.errors.price_currency?.message
                        }
                      />
                      <TextField
                        type="number"
                        label="تعداد توکن"
                        {...form.register("token_count")}
                        error={!!form.formState.errors.token_count}
                        helperText={form.formState.errors.token_count?.message}
                      />
                      <TextField
                        type="number"
                        label="توکن فروخته‌شده"
                        {...form.register("token_sold")}
                        error={!!form.formState.errors.token_sold}
                        helperText={
                          form.formState.errors.token_sold?.message ?? "اختیاری"
                        }
                      />
                      <TextField
                        label="نام توکن"
                        {...form.register("token_name")}
                        error={!!form.formState.errors.token_name}
                        helperText={form.formState.errors.token_name?.message}
                      />
                      <TextField
                        label="قیمت فروش هر متر ملک"
                        {...form.register("sale_price_per_meter")}
                        error={!!form.formState.errors.sale_price_per_meter}
                        helperText={
                          form.formState.errors.sale_price_per_meter?.message ??
                          "اختیاری"
                        }
                      />
                      <TextField
                        label="قیمت هر توکن (تومان)"
                        {...form.register("token_price_toman")}
                        error={!!form.formState.errors.token_price_toman}
                        helperText={
                          form.formState.errors.token_price_toman?.message ??
                          "اختیاری"
                        }
                      />
                      <TextField
                        label="قیمت هر متر به توکن"
                        {...form.register("price_per_meter_token")}
                        error={!!form.formState.errors.price_per_meter_token}
                        helperText={
                          form.formState.errors.price_per_meter_token
                            ?.message ?? "اختیاری"
                        }
                      />
                      <TextField
                        label="درصد سود پیش‌بینی‌شده"
                        {...form.register("estimated_profit_percentage")}
                        error={
                          !!form.formState.errors.estimated_profit_percentage
                        }
                        helperText={
                          form.formState.errors.estimated_profit_percentage
                            ?.message ?? "اختیاری"
                        }
                      />
                      <Controller
                        name="start_time"
                        control={form.control}
                        render={({ field }) => (
                          <CustomDatePicker
                            label="تاریخ شروع (شمسی)"
                            value={
                              field.value
                                ? moment(field.value, "jYYYY/jMM/jDD", true)
                                : null
                            }
                            onChange={(value: Moment | null) =>
                              field.onChange(
                                value?.isValid()
                                  ? value.format("jYYYY/jMM/jDD")
                                  : "",
                              )
                            }
                            slotProps={{
                              textField: {
                                error: !!form.formState.errors.start_time,
                                helperText:
                                  form.formState.errors.start_time?.message,
                              },
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="dead_line"
                        control={form.control}
                        render={({ field }) => (
                          <CustomDatePicker
                            label="ددلاین (شمسی)"
                            value={
                              field.value
                                ? moment(field.value, "jYYYY/jMM/jDD", true)
                                : null
                            }
                            onChange={(value: Moment | null) =>
                              field.onChange(
                                value?.isValid()
                                  ? value.format("jYYYY/jMM/jDD")
                                  : "",
                              )
                            }
                            slotProps={{
                              textField: {
                                error: !!form.formState.errors.dead_line,
                                helperText:
                                  form.formState.errors.dead_line?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Box>
                    <TextField
                      label="توضیحات"
                      {...form.register("description")}
                      error={!!form.formState.errors.description}
                      helperText={form.formState.errors.description?.message}
                      multiline
                      minRows={3}
                    />
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        امکانات پروژه
                      </Typography>
                      <Controller
                        name="options"
                        control={form.control}
                        render={({ field }) => (
                          <FormGroup row>
                            {projectOptions.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={
                                  <Checkbox
                                    checked={field.value.includes(option.value)}
                                    onChange={(event) => {
                                      const next = event.target.checked
                                        ? [...field.value, option.value]
                                        : field.value.filter(
                                            (item) => item !== option.value,
                                          );
                                      field.onChange(next);
                                    }}
                                  />
                                }
                                label={option.label}
                              />
                            ))}
                          </FormGroup>
                        )}
                      />
                    </Stack>
                  </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      لوکیشن پروژه
                    </Typography>
                    <TextField
                      label="مختصات (lat lng)"
                      value={locationValue}
                      onChange={(event) =>
                        form.setValue("location", event.target.value, {
                          shouldValidate: true,
                        })
                      }
                      error={!!form.formState.errors.location}
                      helperText={
                        form.formState.errors.location?.message ??
                        "روی نقشه کلیک کنید یا دستی وارد کنید"
                      }
                    />
                    <MapLocationPicker
                      value={locationValue}
                      onChange={(value) =>
                        form.setValue("location", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    />
                  </Stack>
                </Paper>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/projects")}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={createMutation.isPending}
                  >
                    ایجاد پروژه و رفتن به استپ مدیا
                  </Button>
                </Stack>
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack spacing={2}>
                <Chip
                  color="success"
                  label={`پروژه با شناسه ${createdProjectId} ایجاد شد`}
                  sx={{ alignSelf: "flex-start" }}
                />
                <Divider textAlign="right">
                  افزودن مدیا به پروژه (آپلود لحظه‌ای)
                </Divider>

                <MediaUploadSection
                  title="تصاویر پروژه"
                  helperText="با انتخاب فایل، عکس‌ها همان لحظه و دونه‌دونه آپلود می‌شوند."
                  accept="image/*"
                  mediaType="img"
                  files={imagePreviews}
                  onChange={handleMediaChange}
                  onRemove={handleRemoveMedia}
                  disabled={uploadMediaMutation.isPending}
                  renderPreview={(item) => (
                    <Box
                      component="img"
                      src={item.url}
                      alt={item.file.name}
                      sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  )}
                />

                <MediaUploadSection
                  title="ویدیوهای پروژه"
                  helperText="با انتخاب فایل، ویدیوها همان لحظه و دونه‌دونه آپلود می‌شوند."
                  accept="video/*"
                  mediaType="video"
                  files={videoPreviews}
                  onChange={handleMediaChange}
                  onRemove={handleRemoveMedia}
                  disabled={uploadMediaMutation.isPending}
                  renderPreview={(item) => (
                    <Box
                      component="video"
                      controls
                      src={item.url}
                      sx={{
                        width: "100%",
                        height: 120,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "black",
                      }}
                    />
                  )}
                />

                <MediaUploadSection
                  title="PDFهای پروژه"
                  helperText="با انتخاب فایل، PDFها همان لحظه و دونه‌دونه آپلود می‌شوند."
                  accept="application/pdf"
                  mediaType="pdf"
                  files={mediaFiles.pdf.map((file) => ({ file, url: "" }))}
                  onChange={handleMediaChange}
                  onRemove={handleRemoveMedia}
                  disabled={uploadMediaMutation.isPending}
                  renderPreview={() => null}
                />

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <Button variant="outlined" onClick={() => setActiveStep(0)}>
                    مرحله قبل
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/projects")}
                  >
                    اتمام و بازگشت به لیست
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
