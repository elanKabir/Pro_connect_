import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ViewApplicantForm from '../components/Projects/ViewApplicantForm'
import MakePage from '../components/MakePage';

const ViewApplicant = (props: {
    setTokenHandler: (token: string | null) => void;
    token: string | null;
  }) => {
    const { project_id } = useParams(); 
    const {user_id} = useParams();
        useEffect(() => {
    }, [project_id, user_id]);
    return (
      <>
        <MakePage
          pageTitle={'Applicant View'}
          token={props.token}
          setTokenHandler={props.setTokenHandler}
          pageElement={<ViewApplicantForm token={props.token} pid={project_id} uid={user_id}/>}
          />
      </>
    );
  };
  
  export default ViewApplicant;