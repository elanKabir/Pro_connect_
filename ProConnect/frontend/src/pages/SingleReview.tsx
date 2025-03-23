import React from 'react';
import MakePage from '../components/MakePage';

import { useParams } from 'react-router-dom';

import ViewSingleReview from '../components/UserReviews/SingleReview';

const SingleReviewPage = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { review_id } = useParams();
  const { uid } = useParams();
  return (
    <>
      <MakePage
        pageTitle={'All Reviews'}
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ViewSingleReview token={props.token} review_id={review_id} user_id={uid}/>}
        />
    </>
  );
};

export default SingleReviewPage;
