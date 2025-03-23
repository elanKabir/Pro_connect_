import React, { useEffect } from 'react';
import MakePage from '../components/MakePage';

import { useParams } from 'react-router-dom';
import UserReviews from '../components/UserReviews/UsersReviews';

const Reviews = (props: {
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
        pageTitle={'All Reviews'}
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<UserReviews token={props.token} user_id={uid}/>}
        />
    </>
  );
};

export default Reviews;
