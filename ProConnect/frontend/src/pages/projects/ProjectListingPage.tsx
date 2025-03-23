import MakePage from '../../components/MakePage';
import ProjectListingLayout from '../../components/ProjectListing/ProjectListingLayout';

/**
 * Renders the project listing page.
 * @param {Object} props - The props object.
 * @param {string | null} props.token - The authentication token.
 * @param {Function} props.setTokenHandler - The function to set the authentication token.
 * @returns {JSX.Element} - The project listing page component.
 */
const ProjectListingPage = (props: {
  token: string | null;
  setTokenHandler: (token: string | null) => void;
}) => {
  return (
    <MakePage
      pageTitle="Projects"
      token={props.token}
      setTokenHandler={props.setTokenHandler}
      pageElement={<ProjectListingLayout />}
    />
  );
};

export default ProjectListingPage;
