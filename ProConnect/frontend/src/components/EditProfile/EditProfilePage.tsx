import React, { useEffect, useState } from 'react';
//import MakePage from '../components/MakePage';
import jwt from 'jwt-decode';
import { Box, Grid, Typography } from '@mui/material';
import makeRequestFn from '../../apis/makeRequest';
import EditProfileDropdown from './EditProfileDropdown';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EditSetters, EditValues, User, confirmationDialog, userDetails } from '../../apis/types';
import EditProfileHeader from './EditProfileHeader';

type ProfileHeaderProps = {
    token: string | null;
    user_id : string | undefined;
    setToken: (token: string | null) => void;
};

const EditProfilePage: React.FC<ProfileHeaderProps> = ({token,setToken,user_id}) => {
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = React.useState<string>('');
    const [userDetails, setUserDetails] = useState<userDetails>({
        email: '',
        entityname: '',
        phone: '',
        location: '',
        abn: '',
        role: '',
        cv_id: null,
        img_id: null,
        skills: [],
        company_bio: ''
    });
    const [isUsersProfile, setIsUsersProfile] = useState<boolean>(false)

    const [editEmail, setEditEmail] = useState<string>('');
    const [editPhone, setEditPhone] = useState<string>('');
    const [editLocation, setEditLocation] = useState<string>('');
    const [editName, setEditName] = useState<string>('');

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [open, setOpen] = React.useState<boolean>(false);

    //Get the token values
    try {
        var user: User = jwt(token!);
      } catch (error) {
        user = {
          uid: 'null',
          email: 'null',
          entityname: 'null',
          abn: 'null',
          role: 'null',
        };
    }
    useEffect(() => {
        makeRequestFn('/userdetail?user_id=' + user_id,'GET',undefined,token,handleUserDetails);
    }, [token, user_id]);

    const getUpdatedUserDetails = async () => {
        try {
            makeRequestFn('/userdetail?user_id=' + user_id,'GET',undefined,token,handleUserDetails);
        } catch(error: any) {
            alert(error.message)
        }
    }

    const handleUserDetails = (data: any) => {
        setUserDetails(data.user_info);
        if (user.uid === user_id) {
            setIsUsersProfile(true)
        } else {
            setIsUsersProfile(false)
        }
        if (data.img_data !== null) {
            const imageSrc = 'data:' + data.img_data.content_type +';base64,' + data.img_data.data.$binary.base64
            setProfilePicture(imageSrc)
        } else {
            setProfilePicture('')
        }
    }

    const onSubmitEditfn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const newLocation = (editLocation === '' || editLocation === null) ? userDetails.location : editLocation;
        const newEmail = (editEmail === '' || editEmail === null) ? userDetails.email : editEmail;
        const newPhone = (editPhone === '' || editPhone === null) ? userDetails.phone : editPhone;
        const newName = (editName === '' || editName === null) ? userDetails.entityname : editName;

        if (!isValidEmail(editEmail) && editEmail !=='') {
            toast.error('Please enter a valid email address')
            return
        }
        if (!(isValidNumber(editPhone)) && editPhone !== '') {
            toast.error("Please enter a valid phone number")
            return
        }
        if (editLocation === '' && editEmail === ''  && editName === '') {
            toast.error('At least one field must be changed to edit profile')
            return
        }
        const data = {
            "email": newEmail,
            "phone": newPhone,
            "location": newLocation,
            "entityname":newName
        }
        try {
            await makeRequestFn('/v2/edit_profile','PUT',data,token,handleNewToken)
            toast.success('Profile was edited successfully')
            clearEditFormData()
        } catch (error :any) {
            toast.error(error.message)
        }
        await getUpdatedUserDetails()
    }
    const handleNewToken = (data :any) => {
        setToken(data.new_token)
        token = localStorage.getItem('token')
    }
    const isValidEmail = (email:string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidNumber = (value :string) => {
        const num = Number(value);
        return Number.isInteger(num);
      };



    const handlePasswordErrorChecking = () => {
        if (
          currentPassword === '' ||
          currentPassword === null ||
          newPassword === '' ||
          newPassword === null ||
          confirmNewPassword === '' ||
          confirmNewPassword === null
        ) {
          toast.error('All Fields Need To Completed')
          return false;
        } else if (newPassword !== confirmNewPassword) {
          toast.error('Passwords need to match');
          return false;
        }
        return true;
    };

    const clearEditFormData = () => {
        setEditEmail('')
        setEditLocation('')
        setEditPhone('')
        setEditName('')
    }

    const onDiscardEditForm = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearEditFormData()
    }
    const onDiscardPasswordForm = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
    }

    const onPasswordChangeFn = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (handlePasswordErrorChecking() == true) {
            const data = {
                "old_password": currentPassword,
                "new_password": newPassword
            }
            try {
                await makeRequestFn('/v3/change_password?user_id=' + user_id,'POST',data,token,undefined)
                toast.success('Password has been successfully changed')
            }
            catch(error: any) {
                toast.error(error.message +' Jeu ')
            }
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        }
    }
    const deleteActionFunction = async () => {
        try {
            await makeRequestFn('/v3/delete_account?uid=' + user.uid,'DELETE',undefined,token,undefined);
            setToken(null);
            localStorage.removeItem('token');
            toast.success("Account has been delete successfully.We'll miss you!!")
            navigate("/")
        } catch (error: any) { // Here TypeScript doesn’t know the type of error, hence it's unknown
            toast.error(error.message)
        }
    }

    const onclose = () => {
        setOpen(false)
    }
    const opendialog = () => {
        setOpen(true)
    }
    const confirmationDialog :confirmationDialog =  {
        title : "Delete Account",
        content: 'Are you sure you want to delete your account? This action cannot be undone',
        cancelButton: 'Cancel',
        confirmButton: 'Delete',
        openStatus:open,
        actionFn:deleteActionFunction,
        onClose:onclose,
        openDialog : opendialog,
        setOpen: setOpen
    }
    const EditValues: EditValues = {
        editMail: editEmail,
        editPhone: editPhone,
        editLocation:editLocation,
        editName:editName,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
    }
    const EditSetters: EditSetters = {
        setEditEmail: setEditEmail,
        setEditName: setEditName,
        setEditPhone: setEditPhone,
        setEditLocation: setEditLocation,
        setCurrentPassword: setCurrentPassword,
        setNewPassword: setNewPassword,
        setConfirmNewPassword: setConfirmNewPassword,
        setEdit :onSubmitEditfn,
        onDiscardEditForm: onDiscardEditForm,
        onPasswordChangeFn : onPasswordChangeFn,
        onDiscardPasswordForm: onDiscardPasswordForm,
        getUpdatedUserDetails : getUpdatedUserDetails
    }
    return (
        <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center">
            {user.uid === user_id ?
            <>
            <Grid container spacing={2} style={{overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap', width:'90vw'}}>
                <Grid item xs={12}>
                    <EditProfileHeader userDetails={userDetails} user_id={user_id} token={token} avatarUrl={profilePicture}  setAvatar={setProfilePicture}/>
                </Grid>
                <Grid item xs={12} style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                   <EditProfileDropdown
                        EditValues = {EditValues}
                        EditSetters = {EditSetters}
                        confirmationDialog = {confirmationDialog}
                        userDetails = {userDetails}
                    />
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
            </>
            :
            <>
            <Typography variant='h1'>ACCESS DENIED</Typography>
            </>
            }

        </Box>
    );
}
export default EditProfilePage;
