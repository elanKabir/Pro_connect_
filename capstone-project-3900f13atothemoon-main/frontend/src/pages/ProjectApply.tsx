import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MakePage from '../components/MakePage';
import ProjectApply from '../components/Projects/ProjectApply'

const ProjectApplyPage = (props: {
    setTokenHandler: (token: string | null) => void;
    token: string | null;
  }) => {
    const { project_id } = useParams(); 
    useEffect(() => {
      console.log("EFFECT", project_id);  
    }, [project_id]);
    return (
      <>
        <MakePage
          pageTitle={'Project Apply'}
          token={props.token}
          setTokenHandler={props.setTokenHandler}
          pageElement={<ProjectApply token={props.token} pid={project_id}/>}
          />
      </>
    );
  };
  
  export default ProjectApplyPage;