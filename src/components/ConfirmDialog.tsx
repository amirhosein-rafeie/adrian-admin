import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export const ConfirmDialog = ({
  open,
  title,
  description,
  onClose,
  onConfirm
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">{description}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);
