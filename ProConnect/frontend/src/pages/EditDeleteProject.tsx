import React, { useEffect } from 'react';
import MakePage from '../components/MakePage';
import ProjectModifyPage from '../components/EditProject/ProjectModifyPage';
import { useParams } from 'react-router-dom';

const EditDeleteProject = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  const { project_id } = useParams();
  useEffect(() => {
    console.log("EFFECT", `project_id`);
  }, [project_id]);
  return (
    <>
      <MakePage
        pageTitle="Modify Project Details"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ProjectModifyPage token={props.token} setToken={props.setTokenHandler} project_id={project_id}/>}
      />
    </>
  );
};

export default EditDeleteProject;
