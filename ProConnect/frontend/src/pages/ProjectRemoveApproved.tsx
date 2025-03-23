import React from 'react';
import MakePage from '../components/MakePage';
import ApprovedUserList from '../components/ProjectRemove/ApprovedUserList';

const ProjectRemoveApproved = (props: {
    setTokenHandler: (token: string | null) => void;
    token: string | null;
  }) => {
    // function to remove user from list 
    const handleRemoveUser = (userId: string) => {
      const updatedUserList = users.filter(user => user.id !== userId);
      setUsers(updatedUserList);
    };
  
    // TODO replace with actual data fetch
    const [users, setUsers] = React.useState([
        { id: '1', name: 'Jeff' },
        { id: '2', name: 'Elan' },
        { id: '3', name: 'Zhengyu' },
    ]);
  
    return (
      <>
        <MakePage
          pageTitle="Approved Users List"
          token={props.token}
          setTokenHandler={props.setTokenHandler}
          pageElement={
            <ApprovedUserList users={users} onRemoveUser={handleRemoveUser} /> 
          }
        />
      </>
    );
  };
  
  export default ProjectRemoveApproved;