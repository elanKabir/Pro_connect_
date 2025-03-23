import MakePage from '../components/MakePage';
import CertificateListingLayout from '../components/Certificate/CertificateListingLayout';

/**
 * Renders the Certificate Listing Page component.
 * @param {Object} props - The component props.
 * @param {string | null} props.token - The user token.
 * @param {(token: string | null) => void} props.setTokenHandler - The function to set the user token.
 * @returns {JSX.Element} - The Certificate Listing Page component.
 */
const CertificateListingPage = (props: {
  token: string | null;
  setTokenHandler: (token: string | null) => void;
}) => {
  return (
    <MakePage
      token={props.token}
      setTokenHandler={props.setTokenHandler}
      pageTitle="My Certificates"
      pageElement={<CertificateListingLayout token={props.token} />}
    />
  );
};

export default CertificateListingPage;
