import React from 'react';
import MakePage from '../components/MakePage';

import ProfessionalListingPageLayout from '../components/Professional/ProfessionalListingPageLayout';

const ProfessionalPage = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {

  return (
    <>
      <MakePage
        pageTitle="Professionals"
        token={props.token}
        setTokenHandler={props.setTokenHandler}
        pageElement={<ProfessionalListingPageLayout />}
      />
    </>
  );
};

export default ProfessionalPage;
