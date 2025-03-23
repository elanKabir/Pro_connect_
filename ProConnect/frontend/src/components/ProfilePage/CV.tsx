import React, { useState } from 'react';
import { Button, Box, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import makeRequestFormData from '../../apis/makeRequestFormData';
import { ProfilePageObject, Setters } from '../../apis/types';

interface cv_props {
    Setters : Setters
    ProfilePageObject: ProfilePageObject
}


const CV: React.FC<cv_props> = ({ProfilePageObject,Setters}) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };
    const handleUploadData = async (data:any) => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('cv', selectedFile);
            console.log(formData)
            const response = await makeRequestFormData('/upload_cv','POST',formData,ProfilePageObject.token);
            if (response.status === 'success') {
                toast.success("CV uploaded successfully")
                Setters.getUserDetails()
                setSelectedFile(null)
                //Get the api call to update the new values.
            } else {
                toast.error("CV failed to upload")
            }
        }
    }
    const base64ToBlob = (base64: string, contentType: string): Blob | null => {
        try {
            const byteCharacters = atob(base64);
            const byteArrays: Uint8Array[] = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            return new Blob(byteArrays, { type: contentType });
        } catch (error) {
            console.error('Error in base64 to Blob conversion: ', error);
            return null;
        }
    };

    const downloadFile = () => {
        if (!ProfilePageObject.Cv_information.base64 || ProfilePageObject.Cv_information.base64.length === 0) {
           toast.error('No file has been uploaded')
           return
        }
        const blob = base64ToBlob(ProfilePageObject.Cv_information.base64, ProfilePageObject.Cv_information.contentType);
        if (!blob) {
            toast.error('Failed to convert base64 to Blob.');
            return;
        }
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = ProfilePageObject.Cv_information.fileName; // Customize the file name
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl);
    };
    return (
    <Box>
        <Grid container spacing={1}  alignItems='center' justifyContent='center' sx={{display: 'flex', flexWrap: 'wrap'}}>
        {ProfilePageObject.isUsersProfile && (
            <>
            <Grid item xs={12} display="flex" justifyContent="center">
               <input
                    accept = "application/pdf"
                    style = {{ display: 'none' }}
                    id= "raised-button-file"
                    type= "file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span">
                        Upload CV
                    </Button>
                </label>
            </Grid>
             <Grid item xs={12} display="flex" justifyContent="center">
                    {selectedFile && <Button onClick={handleUploadData}>Send</Button>}
            </Grid>
            </>
        )}
         {ProfilePageObject.Cv_information.base64 !== null ? (
                <Grid item xs={12} display="flex" justifyContent="center">
                <Button onClick={() => downloadFile()}>DOWNLOAD {ProfilePageObject.Cv_information.fileName}</Button>
                </Grid>
            ) : (
                <Grid item xs={12} display="flex" justifyContent="center">
                <Button>NO FILE UPLOADED</Button>
                </Grid>
            )}
        </Grid>
    </Box>
    );
};
export default CV;


