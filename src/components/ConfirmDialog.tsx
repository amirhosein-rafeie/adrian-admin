import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({ open, title, description, onClose, onConfirm }: Props) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{description}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>انصراف</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>
        تایید
      </Button>
    </DialogActions>
  </Dialog>
);
