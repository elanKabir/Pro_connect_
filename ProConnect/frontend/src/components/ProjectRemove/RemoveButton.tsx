import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../ConfirmationDialog';

type RemoveButtonProps = {
    onConfirmRemove: () => void;
  };
  
  const RemoveButton: React.FC<RemoveButtonProps> = ({ onConfirmRemove }) => {
    const [removeUserDialog, setremoveUserDialog] = useState(false);
    
    const handleOpenDialog = () => {
        setremoveUserDialog(true);
    };
  
    const handleCloseDialog = () => {
        setremoveUserDialog(false);
    };
  
    return (
      <>
        <IconButton onClick={handleOpenDialog}>
          <DeleteIcon />
        </IconButton>
        <ConfirmationDialog
        openStatus={removeUserDialog}
        onClose={() => {
            setremoveUserDialog(false);
        }}
        title="Remove User?"
        content={'Are you sure you want to remove this user?'}
        cancelButton="Cancel"
        confirmButton="Remove User"
        actionFn={() => {
            onConfirmRemove();
            setremoveUserDialog(false);
        }}
        />
      </>
    );
  };
  
  export default RemoveButton;