import MakePage from '../../components/MakePage';
import DashboardLayout from '../../components/Admin/DashboardLayout';

/**
 * Renders the admin dashboard page.
 * @param {Object} props - The component props.
 * @param {Function} props.setTokenHandler - The function to set the authentication token.
 * @param {string | null} props.token - The authentication token.
 * @returns {JSX.Element} - The rendered component.
 */

const AdminDashboard = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  return (
    <>
      <MakePage
        pageTitle="Dashboard"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<DashboardLayout />}
      />
    </>
  );
};

export default AdminDashboard;
