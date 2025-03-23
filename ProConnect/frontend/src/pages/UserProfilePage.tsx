import React from 'react';
import MakePage from '../components/MakePage';


const UserProfilePage = (props: {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
}) => {
  return (
    <>
      <MakePage
        pageTitle={'Profile Page'}
        token={props.token}
        setTokenHandler={props.setToken}
        pageElement={<>hi</>}
      />
    </>
  );
};
export default UserProfilePage;
