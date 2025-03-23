import React, { useState } from 'react';
import { TextField, Button, List, Divider, ListItemText, ListItemButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export const UserProfile: React.FC = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };
    


    return (
        <div 
            style={{ margin: 'auto', padding: '20px', background: 'whitesmoke', minHeight: '100vh', boxSizing: 'border-box'}}>
            <h2 style={{ boxSizing: 'content-box' }}>Settings</h2>
            <List style={{ margin: 'auto auto 20px', padding: '10px', background:'white', boxSizing: 'content-box', width: '1000px' }}>
                <ListItemText primary="Profile" />
            </List>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', boxSizing: 'content-box' }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-input"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="image-upload-input" style={{ cursor: 'pointer', boxSizing: 'content-box' }}>
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%' }}/>
                    ) : (
                        <AccountCircle style={{ fontSize: 60 }}/>
                    )}
                </label>
            </div>
            
            <div style={{ background:'white', width: '500px', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
                <TextField fullWidth label="Professional/Company Name" variant="outlined" defaultValue="SUPERCELL" />
            </div>
            
            <div style={{ marginBottom: '20px', background:'white', width: '500px', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
                <TextField fullWidth label="Email" variant="outlined" defaultValue="comp3900@unsw.cse.au" />
            </div>
            
            <div style={{ marginBottom: '20px', background:'white', width: '500px', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
                <TextField fullWidth label="Phone" variant="outlined" defaultValue="+61 432 123 221" />
            </div>

            <div style={{ marginBottom: '20px', background:'white', width: '500px', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
                <TextField fullWidth label="Location" variant="outlined" defaultValue="Sydney" />
            </div>

        <div style={{ marginBottom: '20px', background:'white', width: '500px', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
            <TextField fullWidth label="ABN/ACN" variant="outlined" />
        </div>
        
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto auto 20px', boxSizing: 'content-box' }}>
                <Button variant="contained" color="primary">
                    Save Changes
                </Button>
            </div>

            <List style={{ margin: 'auto auto 20px', padding: '10px', background:'white', boxSizing: 'content-box', width: '1000px' }}>
                <ListItemButton style={{ width: '1200px', height: '50px', fontSize: '18px' }}>
                    <ListItemText primary="Password" />
                </ListItemButton>
                <Divider light/>
                <ListItemButton style={{ width: '1200px', height: '50px', fontSize: '18px' }}>
                    <ListItemText primary="Reward Point & Certificates" />
                </ListItemButton>
            </List>
        </div>
    );
}

export default UserProfile;
