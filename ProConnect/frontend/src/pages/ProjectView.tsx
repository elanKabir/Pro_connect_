import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MakePage from '../components/MakePage';
import ProjectDetail from '../components/Projects/ProjectDetail'

const ProjectView = (props: {
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
          pageTitle={'Project Detail'}
          token={props.token}
          setTokenHandler={props.setTokenHandler}
          pageElement={<ProjectDetail token={props.token} pid={project_id}/>}
          />
      </>
    );
  };
  
  export default ProjectView;