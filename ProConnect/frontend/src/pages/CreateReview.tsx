import React from 'react';
import MakePage from '../components/MakePage';

import { useParams } from 'react-router-dom';
import ReviewForm from '../components/CreateReviews/ReviewForm';

const CreateReview = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { project_id } = useParams();
  const {uid} = useParams()
  return (
    <>
      <MakePage
        pageTitle="Leave Review"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ReviewForm token={props.token} project_id={project_id} user_id={uid}/>}
      />
    </>
  );
};

export default CreateReview;