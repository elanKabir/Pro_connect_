import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

type RemoveConfirmationDialogProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
  
  const RemoveConfirmationDialog: React.FC<RemoveConfirmationDialogProps> = ({ open, onConfirm, onCancel }) => {
    return (
      <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default RemoveConfirmationDialog;