import React from 'react';
import IndividualProjectListingTable from '../ProjectListing/IndividualProjectListingTable';
import axios from 'axios';
import { BACKEND_API_URL } from '../../apis/config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import ConfirmationDialog from '../ConfirmationDialog';
import Certificate from './Certificate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CERTIFICATE_API_URL = BACKEND_API_URL + '/v1/mycertificate';
const certificateTableHeaders = [
  'ID',
  'Project Name',
  'Company Name',
  'Date Issued',
  'Actions',
];

type certificateInfo = {
  certificateID: string;
  projectName: string;
  companyName: string;
  dateIssued: string;
  userID: string;
  userName: string;
};

/**
 * Renders a table of certificates and allows the user to view and download them.
 * @param {Object} props - The component props.
 * @param {string|null} props.token - The user's authentication token.
 * @returns {JSX.Element} - The CertificateListingLayout component.
 */
const CertificateListingLayout = (props: { token: string | null }) => {
  const [certificateDataRows, setCertificateDataRows] = React.useState<any[]>(
    []
  );
  const [userCertificateViewer, setUserCertificateViewer] =
    React.useState<boolean>(false);
  const [certificateInfo, setCertificateInfo] = React.useState<certificateInfo>(
    {
      certificateID: '',
      projectName: '',
      companyName: '',
      dateIssued: '',
      userID: '',
      userName: '',
    }
  );

  const handleDownload = async () => {
    const element = document.getElementById('certificate');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certificateInfo.certificateID}.pdf`);
    }
  };

  React.useEffect(() => {
    axios
      .get(CERTIFICATE_API_URL, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const data = response.data.data;

        setCertificateDataRows(
          data.map((certificate: any) => {
            console.log(certificate._id.$oid);
            return {
              id: certificate._id.$oid.toString(),
              project_name: certificate.project_title.toUpperCase(),
              company_name: certificate.project_owner,
              date_issued: certificate.date_issued,
              actions: (
                <>
                  <IconButton
                    onClick={() => {
                      setCertificateInfo({
                        certificateID: certificate._id.$oid.toString(),
                        projectName: certificate.project_title.toUpperCase(),
                        companyName: certificate.project_owner,
                        dateIssued: certificate.date_issued,
                        userID: certificate.user_id,
                        userName: certificate.name,
                      });
                      setUserCertificateViewer(true);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </>
              ),
            };
          })
        );
      });
  }, [props.token]);

  return (
    <>
      <IndividualProjectListingTable
        tableName={'My Certificates'}
        headers={certificateTableHeaders}
        dataRows={certificateDataRows}
        loading={false}
      />
      <ConfirmationDialog
        title={'Certificate Viewer'}
        content={
          <Certificate
            name={certificateInfo.userName}
            projectName={certificateInfo.projectName}
            companyName={certificateInfo.companyName}
            date={certificateInfo.dateIssued}
            certificateID={certificateInfo.certificateID}
            uID={certificateInfo.userID}
          />
        }
        cancelButton={'Close'}
        confirmButton={'Download'}
        actionFn={handleDownload}
        onClose={() => {
          setUserCertificateViewer(false);
        }}
        openStatus={userCertificateViewer}
      />
    </>
  );
};

export default CertificateListingLayout;
