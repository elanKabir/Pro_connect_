import { ReactElement } from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

type ConfirmationDialogProps = {
  title: string;
  content: string | ReactElement;
  cancelButton: string;
  confirmButton: string;
  actionFn: () => void | Promise<void>;
  onClose: () => void;
  openStatus: boolean;
};

/**
 * A dialog component that displays a confirmation message with two buttons: cancel and confirm.
 * @param {boolean} openStatus - The status of the dialog, whether it is open or not.
 * @param {string} title - The title of the dialog.
 * @param {string | ReactElement} content - The content of the dialog, which can be a string or a React element.
 * @param {string} cancelButton - The text displayed on the cancel button.
 * @param {string} confirmButton - The text displayed on the confirm button.
 * @param {() => void | Promise<void>} actionFn - The function to be executed when the confirm button is clicked.
 * @param {() => void} onClose - The function to be executed when the dialog is closed.
 * @returns {ReactElement} A React element representing the confirmation dialog.
 */
const ConfirmationDialog = ({
  openStatus,
  title,
  content,
  cancelButton,
  confirmButton,
  actionFn,
  onClose,
}: ConfirmationDialogProps) => {
  return (
    <div>
      <Dialog
        open={openStatus}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            {cancelButton}
          </Button>
          <Button
            onClick={actionFn}
            variant="contained"
            color="error"
            autoFocus
          >
            {confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
