import React, { useState } from 'react';
import { ListItem, ListItemText, Divider, IconButton, ListItemSecondaryAction, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { BACKEND_API_URL } from '../../apis/config';
import axios from 'axios';

type NotificationProps = {
  notification: Notification;
  token: string | null;
  onNotificationUpdate: () => void;
};

type Notification = {
  notification_id: string;
  user_id: string;
  message: string;
  timestamp: string;
  read_status: string;
}


const NotificationItem: React.FC<NotificationProps> = ({ notification, token, onNotificationUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleDelete = () => {
    onDelete(notification.notification_id); 
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); 
  };

  const handleToggleRead = () => {
    onToggleRead(notification.notification_id); 
  };

  function onToggleRead(id: string): void {
    const url = `${BACKEND_API_URL}/edit_notification?notification_id=${id}`;

  // Set up the request options
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`, // Assuming 'token' is available in this scope
      'Content-Type': 'application/json'
    },
  };

  // Make the API call
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // Handle successful read status update
        // update the state to re-render this component or notify the user
        onNotificationUpdate();
      } else {
        // Handle failure
        console.error('Failed to update read status:', data.message);
      }
    })
    .catch(error => {
      // Handle network or other errors
      console.error('Error updating notification read status:', error);
    });
  }

  function onDelete(id: string): void {
    const url = `${BACKEND_API_URL}/delete_notification?notification_id=${id}`;
  
    axios.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`, // Assuming 'token' is available in this scope
      }
    })
    .then(response => {
      const data = response.data;
      if (data.status === 'success') {
        onNotificationUpdate();
      } else {
        console.error('Failed to delete notification:', data.message);
      }
    })
    .catch(error => {
      console.error('Error deleting notification:', error);
    });
  }

  return (
<>
      <ListItem
        sx={{
          minHeight: '40%',
          padding: '10px',
          display: 'flex', // Use flex display
          justifyContent: 'space-between', // Space between text and icons
          width: '100%', 
          maxWidth: '90%',
        }}
        onClick={handleToggleRead}
      >
        <ListItemIcon>
          {notification.read_status ? 
            <CheckCircleOutlineIcon color="primary" /> : 
            <FiberManualRecordIcon color="error" />}
        </ListItemIcon>
        <ListItemText
          primary={notification.message}
          secondary={new Date(notification.timestamp).toLocaleString()}
          primaryTypographyProps={{
            noWrap: !isExpanded,
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            style: {
              maxWidth: isExpanded ? '90%' : '70%', // Use more width when expanded
              fontSize: '0.9rem', // Adjust font size
            },
          }}
          onClick={toggleExpand}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          <IconButton edge="end" onClick={toggleExpand}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

export default NotificationItem;
