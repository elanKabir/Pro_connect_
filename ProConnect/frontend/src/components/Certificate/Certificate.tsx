import Logo from '../../assets/logo.png';
import './certificate.css';

/**
 * Certificate component displays a certificate of completion for a project.
 * @param {Object} props - The props object containing the following properties:
 * @param {string} props.name - The name of the recipient.
 * @param {string} props.projectName - The name of the project.
 * @param {string} props.companyName - The name of the company.
 * @param {string} props.date - The date of completion.
 * @param {string} props.certificateID - The ID of the certificate.
 * @param {string} props.uID - The ID of the user.
 * @returns {JSX.Element} - A React component that displays a certificate of completion.
 */
const Certificate = (props: {
  name: string;
  projectName: string;
  companyName: string;
  date: string;
  certificateID: string;
  uID: string;
}) => {
  return (
    <div className="certificate-container">
      <div className="certificate" id="certificate">
        <div className="border">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>
          <h1 style={{ fontFamily: 'UnifrakturMaguntia' }}>
            Certificate of Completion
          </h1>
          <p
            style={{
              fontFamily: 'Garet',
            }}
          >
            This is to certify that
          </p>
          <p
            className="recipient"
            style={{
              fontFamily: 'Times New Roman',
            }}
          >
            {props.name}
          </p>
          <p
            style={{
              fontFamily: 'Garet',
            }}
          >
            have successfully completed {props.projectName} with{' '}
            {props.companyName}
          </p>
          <p
            style={{
              fontFamily: 'Garet',
              fontStyle: 'italic',
            }}
          >
            on {props.date}.
          </p>
          <div
            className="bottom-row"
            style={{
              fontFamily: 'Garet',
            }}
          >
            <div className="left-corner">
              <p>{props.certificateID}</p>
            </div>
            <div className="right-corner">
              <p>{props.uID}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
