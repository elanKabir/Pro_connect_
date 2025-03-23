import * as React from 'react';
import TextField from '@mui/material/TextField';

type RegisterFormTextFieldProps = {
    label: string;
    withButton?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    value?:string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?:string
}
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};
const EditProfileTextField: React.FC<RegisterFormTextFieldProps> = ({label, withButton, onClick, value, onChange, type}) => {
    return (
        <div style={containerStyle}>
            <TextField
                type={type}
                fullWidth
                label ={label}
                variant="outlined"
                value={value}
                onChange={onChange}
                sx={{ width: '96%', mb: 1 }}
            />
        </div>
    );
};

export default EditProfileTextField;