import React, { useEffect } from 'react';
import MakePage from '../components/MakePage';
import EditProfilePage from '../components/EditProfile/EditProfilePage';
import { useParams } from 'react-router-dom';

const EditUserProfile =(props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { uid } = useParams();
  useEffect(() => {
    console.log("EDIT PROFILE", uid);
  }, [uid]);
  return (
    <>
      <MakePage
        pageTitle="Edit Profile"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<EditProfilePage token={props.token} setToken={props.setTokenHandler} user_id={uid}/>}
      />
    </>
  );
};

export default EditUserProfile;
