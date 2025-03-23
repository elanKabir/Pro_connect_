import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import makeRequestFn from '../../apis/makeRequest';
import makeFormDataRequest from '../../apis/makeRequestFormData';
import { userDetails } from '../../apis/types';
import { toast } from 'react-toastify';

type ProfilePictureProps = {
    token: string | null;
    user_id: string | undefined;
    userDetails : userDetails
    avatarUrl : string
    setAvatar :  React.Dispatch<React.SetStateAction<string>>,
};
const ProfilePicture: React.FC<ProfilePictureProps> = ({token,user_id, avatarUrl, userDetails, setAvatar}) => {
  const [image, setImage] = useState<File | null>(null);
  const [profilePictire, setProfilePictire] = useState<string>('');

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0])
      const formData = new FormData();
      formData.append('img', event.target.files[0]);
      try {
        const response =  await makeFormDataRequest('/upload_profile_photo','POST',formData,token);
        toast.success('Profile photo changed successfully')
      } catch(error:any) {
        toast.error(error.message)
      }
      try {
        await makeRequestFn('/userdetail?user_id=' + user_id, 'GET', undefined, token, updateUserDetailState);
      } catch (error:any) {
        toast.error(error.message)
      }
    }
  }


  const updateUserDetailState =  (data: any) => {
    if (data.img_data !== null) {
         const imageSrc = 'data:' + data.img_data.content_type +';base64,' + data.img_data.data.$binary.base64;
        //.log('im here')
        setAvatar(imageSrc)
    }
};

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={avatarUrl}
        style={{ width: 100, height: 100 }}
        alt="Profile Picture"/>
      <input
        type="file"
        id="edit-profile-picture"
        style={{ display: 'none' }}
        onChange={handleImageChange}/>
      <label htmlFor="edit-profile-picture">
        <IconButton
          color="primary"
          component="span"
          style={{ position: 'absolute', right: 0, bottom: 0 }}>
          <EditIcon />
        </IconButton>
      </label>
    </div>
  );
};

export default ProfilePicture;