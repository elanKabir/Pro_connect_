import React, { useEffect, useState } from 'react';
import { Avatar, List, ListItem, ListItemText, makeStyles } from '@mui/material';
import RemoveButton from './RemoveButton';
import UserProfileLink from './ProfileLink';


type ApprovedUser = {
    id: string;
    name: string;
  };
  
  type ApprovedUserListProps = {
    users: ApprovedUser[];
    onRemoveUser: (userId: string) => void;
  };
  
  const ApprovedUserList: React.FC<ApprovedUserListProps> = ({ users, onRemoveUser }) => {
    const [userAvatars, setUserAvatars] = useState<{ [key: string]: string }>({});
  
    useEffect(() => {
      fetch('/api/user-avatars')
        .then((response) => response.json())
        .then((data) => {
          setUserAvatars(data);
        })
        .catch((error) => {
          console.error('Error fetching user avatars:', error);
        });
    }, []);
  
    const listItemSeparator = {
      borderTop: '1px solid #e0e0e0',
      marginTop: '8px',
      paddingTop: '8px',
    };
  
    return (
        <List>
          {users.map((user) => (
            <div key={user.id} style={listItemSeparator}>
              <ListItem>
                <Avatar
                  src={userAvatars[user.id]}
                  style={{ marginRight: '16px' }}
                />
                <ListItemText primary={<UserProfileLink userId={user.id} userName={user.name} />} />
                <RemoveButton onConfirmRemove={() => onRemoveUser(user.id)} />
              </ListItem>
            </div>
          ))}
        </List>
      );
    };
    
    export default ApprovedUserList;