import UsersTable from '../../components/Admin/UsersTable';
import MakePage from '../../components/MakePage';

/**
 * Renders a page that displays a table of all users for an admin user.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - A function to set the authentication token.
 * @param {string|null} props.token - The authentication token.
 * @returns {JSX.Element} - The rendered component.
 */
const AdminViewAllUsers = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  return (
    <>
      <MakePage
        pageTitle="All Users"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<UsersTable token={props.token} />}
      />
    </>
  );
};

export default AdminViewAllUsers;
