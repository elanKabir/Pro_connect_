import React from 'react';
import { Link } from 'react-router-dom';

type UserProfileLinkProps = {
  userId: string;
  userName: string;
};

const UserProfileLink: React.FC<UserProfileLinkProps> = ({ userId, userName }) => {
  return (
    <Link to={`/view_profile/${userId}`}>{userName}</Link>
  );
};

export default UserProfileLink;