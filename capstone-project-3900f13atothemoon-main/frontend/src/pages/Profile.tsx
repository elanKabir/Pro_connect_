import React, { useEffect } from 'react';
import MakePage from '../components/MakePage';

import ProfilePage from '../components/ProfilePage/ProfilePage';
import { useParams } from 'react-router-dom';

const Profile = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { uid } = useParams();
  useEffect(() => {
    console.log("EFFECT", uid);
  }, [uid]);
  return (
    <>
      <MakePage
        pageTitle={'Profile Page'}
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ProfilePage token={props.token} user_id={uid}/>}
        />
    </>
  );
};

export default Profile;
