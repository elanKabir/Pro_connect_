import React from 'react';
import MakePage from '../components/MakePage';
import ProjectApplicantsLayout from '../components/Projects/ProjectApplicantsLayout';

/**
 * Renders a page displaying the list of project applicants.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - The function to set the authentication token.
 * @param {string | null} props.token - The authentication token.
 * @returns {JSX.Element} - The rendered component.
 */
const ProjectApplicationList = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  return (
    <MakePage
      setTokenHandler={props.setTokenHandler}
      token={props.token}
      pageTitle="Applicants"
      pageElement={<ProjectApplicantsLayout />}
    />
  );
};

export default ProjectApplicationList;
