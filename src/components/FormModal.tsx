import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}

export const FormModal = ({ open, title, onClose, onSubmit, children }: Props) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent sx={{ pt: '12px !important' }}>{children}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>انصراف</Button>
      <Button variant="contained" onClick={onSubmit}>
        ذخیره
      </Button>
    </DialogActions>
  </Dialog>
);
