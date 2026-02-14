import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export const FormModal = ({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>
  </Dialog>
);
