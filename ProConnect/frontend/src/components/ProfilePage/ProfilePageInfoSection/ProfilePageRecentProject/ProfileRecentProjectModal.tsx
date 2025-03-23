import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
//import ProfileProjectCard from './ProfileProjectCard';
import ProfileRecentProjectCard from "./ProfileRecentProjectCard"

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type ProfileRecentProjectModalProps = {

    token?: string | null;
    user: User,
    projectTitle: string,
    projectPostDate: string,
    projectStatus: string,
    projectBudget: string
}
type User = {
    uid: string;
    email: string;
    entityname: string;
    abn: string;
    role: string;
};






function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const ProfileRecentProjectModal: React.FC<ProfileRecentProjectModalProps> = ({
    user,
    token,
    projectTitle,
    projectPostDate,
    projectStatus,
    projectBudget
    }) => {


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
        <ProfileRecentProjectCard
        onClick={handleOpen}
        projectTitle ={projectTitle}
        projectPostDate = {projectPostDate}
        projectStatus = {projectStatus}
        projectBudget = {projectBudget}
        user = {user}
        />
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
            <h2 id="parent-modal-title">STORE THE PROJECT COMPONENT CONTAINING ALL DETAILS</h2>
            </Box>
        </Modal>
        </div>
    );
}
export default ProfileRecentProjectModal
