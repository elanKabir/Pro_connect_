import MakePage from '../../components/MakePage';
import ProjectTable from '../../components/Admin/ProjectTable';

/**
 * Renders a page that displays all projects for the admin view.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - A function to set the authentication token.
 * @param {string | null} props.token - The authentication token.
 * @returns {JSX.Element} - The rendered component.
 */
const AdminViewAllProject = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  return (
    <>
      <MakePage
        pageTitle="All Projects"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ProjectTable token={props.token} />}
      />
    </>
  );
};

export default AdminViewAllProject;
