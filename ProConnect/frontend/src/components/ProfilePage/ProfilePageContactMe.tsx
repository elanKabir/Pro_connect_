import * as React from 'react';


interface ContactMeProps {
    phone: string;
    email: string;
    linkedin: string;
  }
  
  const styles = {
    // can get rid of box if wanted in future
    contactContainer: {
        padding: '40px', 
        borderRadius: '5px',
    },
    contactContent: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px', 
        color: '#333', 
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px', 
    },
    icon: {
      marginRight: '10px', 
    },
  };

  const ProfilePageContactMe: React.FC<ContactMeProps> = ({ phone, email, linkedin }) => {
    return (
      <div style={styles.contactContainer}>
        <div style={styles.contactContent}>
          <h2>Contact Me</h2>
          <div style={styles.contactItem}>
            <span style={styles.icon}>📞</span>
            <span className="text">{phone}</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.icon}>📧</span>
            <span className="text">{email}</span>
          </div>
          <div style={styles.contactItem}>
            <a href={linkedin} target="_blank" className="linkedin-link">
              <span style={styles.icon}>In</span>
              <span className="text">linkedin@page</span>
            </a>
          </div>
        </div>
      </div>
    );
  };
  export default ProfilePageContactMe;
