import NavbarV2 from './Navbar/NavbarV2';

/**
 * Renders a page with a navbar and a page element.
 * @param {Object} props - The props object.
 * @param {Function} props.setTokenHandler - A function to set the token.
 * @param {string | null} props.token - The token.
 * @param {string} props.pageTitle - The title of the page.
 * @param {JSX.Element} props.pageElement - The element to render on the page.
 * @returns {JSX.Element} - The rendered page.
 */
const MakePage = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
  pageTitle: string;
  pageElement: JSX.Element;
}) => {
  return (
    <>
      <NavbarV2
        pageTitle={props.pageTitle}
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={props.pageElement}
      />
    </>
  );
};

export default MakePage;
