import React from 'react';
import MakePage from '../components/MakePage';
import ProfessionalApplicationLayout from '../components/Professional/ProfessionalApplicationLayout';

const ProfessionalApplicationsPage = (props: {
  setTokenHandler: (token: string | null) => void;
  token: string | null;
}) => {
  return (
    <MakePage
      token={props.token}
      setTokenHandler={props.setTokenHandler}
      pageTitle="My Applications"
      pageElement={<ProfessionalApplicationLayout token={props.token} />}
    />
  );
};

export default ProfessionalApplicationsPage;
